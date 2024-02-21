
import Search from './components/Search'
import './index.css'

function App() {


  return (
    <section className=" w-full flex-center flex-col ">
      
      <div className="">
        <h1 className="head_text text-center">
          Discover & Invest
          <br className="max-md:hidden" />
          <span className="orange_gradient text-center">
            {" "}
            AI-Powered ESG Scores
          </span>
        </h1>
        <p className="desc text-center">
          ESG is a framework that assesses a company&apos;s business practices and performance on sustainability and ethical issues.
        </p>
      </div>
      <Search/>
    </section>
  )
}

export default App
