import { useState } from "react";

import TickerSymbols from "../constants/ticker";



const Search = () => {
    const [company, setCompany] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [companyDetails, setCompanyDetails] = useState();
    const [sector, setSector] = useState()
    const [isOpen, setIsOpen] = useState(false);
    const [esgScore, setEsgScore] = useState(null);
    const backend_url = import.meta.env.BACKEND_URL || "http://127.0.0.1:8000";
    

    const fetchCompanyDetails = async (symbol) => {
    
        const url = `${backend_url}/api/get_company_details?symbol=${symbol}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Sector", data);
            setSector(data.sector);
            print(sector)
            setCompanyDetails(data);
            return data; // Return fetched data
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEsgScore = async (symbol) => {
        if (!symbol) {
            console.log('Company symbol is not defined');
            return;
        }

        const url = `${backend_url}/api/get_esg_score?symbol=${symbol}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEsgScore(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    };


    const fetchCompanyESGSector = async (id) => {
        const url = `${backend_url}/api/get_company_esg_sector?id=${id}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Sector--", data);
            setCompanyDetails(prevState => ({ ...prevState, sector: data.sector }));
        } catch (error) {
            console.error(error);
        }
    };



    const handleSelect = (company) => {
        console.log(company);
        setSearchTerm(company.companyname);
        setIsOpen(false);
        fetchEsgScore(company.symbol);

        setCompanyDetails({ company_name: company.companyname, symbol: company.symbol });

        fetchCompanyDetails(company.symbol).then(data => {
            fetchCompanyESGSector(data.sector);
        });
        
    };





    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        setIsOpen(true);

        const filteredCompanies = TickerSymbols.filter(company =>
            company.name.toLowerCase().includes(event.target.value.toLowerCase())
        );

        setCompany(filteredCompanies);
        
    };



    const filteredCompanies = company?.map(item => ({
        companyname: item.name,
        symbol: item.symbol
    })) || [];



    return (
        <div className="mt-20 w-full">
            <input id="SearchButton" data-dropdown-toggle="dropdownDivider" className="search_input peer" type="text" value={searchTerm} onChange={handleChange} placeholder="Search for company... " />
            {isOpen && (
                <div id="dropdownDivider" className="z-10 search_input w-full mt-5 bg-white text-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-700" aria-labelledby="dropdownDividerButton">
                        {filteredCompanies.map((item, index) => (
                            <li key={index}>
                                <a href="#" onClick={() => handleSelect(item)} className="block px-4 py-2 ">
                                    {item.companyname} ({item.symbol})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {companyDetails && (
                <div className=" items-center justify-center gap-2">
                    <div className="flex-1 mt-10 ">
                        <div className="prompt_card ">
                            <div className="flex justify-between items-center gap-5">
                                <div className="flex flex-wrap items-center justify-center">
                                    <div className="w-full h-full items-center px-4">
                                        <img src={`${companyDetails.logo}`} alt={companyDetails.symbol} className="shadow rounded max-w-full h-auto align-middle border-none" />
                                    </div>
                                </div>
                                <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
                                    <div className="flex flex-col" >
                                        <h3 className="font-inter text-lg text-gray-500">{companyDetails.company_name}</h3>
                                        <p className="my-2 font-satoshi text-sm text-gray-700">Symbol: {companyDetails.symbol}</p>
                                        <p className="my-2 font-satoshi text-sm text-gray-700">Sector: {companyDetails.sector}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {esgScore && (
                            <>
                                <div className="flex max-md:flex-col max-sm:flex-wrap mt-5 gap-3 shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-gray-500 ">
                                        <thead className="text-xs text-gray-700 uppercase ">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 bg-gray-50 ">
                                                    Environment
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    {esgScore.environment_score ?? 'N/A'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Emmision
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.emission ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Innovation
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.innovation ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Resource use
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.resource ?? 'N/A'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="w-full text-sm text-left text-gray-500 ">
                                        <thead className="text-xs text-gray-700 uppercase ">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 bg-gray-50 ">
                                                    Social
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    {esgScore.social_score ?? 'N/A'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Human Right
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.human_rights ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Product responsibility
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.product_responsibility ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Workforce
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.workforce ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Community
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.community ?? 'N/A'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="w-full text-sm text-left text-gray-500 ">
                                        <thead className="text-xs text-gray-700 uppercase ">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 bg-gray-50 ">
                                                    Governance
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    {esgScore.governance_score ?? 'N/A'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Management
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.management ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200 ">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    Shareholder
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.shareholders ?? 'N/A'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-200">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 ">
                                                    CSR Strategy
                                                </th>
                                                <td className="px-6 py-4">
                                                    {esgScore.csr_strategy ?? 'N/A'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div className=" text-center p-20 items-center max-sm:mt-2 max-sm:items-center">
                                    {/* Render your company details here */}
                                    <h1 className=" head_text orange_gradient text-center">Investo Score : <span className="text-gray-900">{esgScore.polarity_score*100 ?? 'N/A'}/100</span></h1>
                                </div>

                            </>
                        )}

                    </div>

                </div>
            )}

        </div>
    )
}

export default Search;
