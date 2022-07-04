import Image from 'next/image'
import Link from 'next/link'

export default function Home({ weatherInfo, city }) {
  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div>
          <div>
            <h1 className="fw-bolder" style={{ fontSize: "60px" }}>
            {city}
            </h1>
            13 January, 2022
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="pe-5">
              <h2 className="d-inline">{Math.round(weatherInfo.main.temp)}</h2>
              <sup>°C</sup>
              <p className="text-info"> {weatherInfo.weather[0].description}</p>
            </div>
            <div>
            <img src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`}/>
            </div>
          </div>
          <hr />
          <div className="d-md-flex justify-content-between align-items-center mt-4">
            <button  onClick={saveWeather} className="btn btn-success border-0 save-btn px-4 py-3">
             Timestamp
            </button>
            <Link href="/history">
              <button className="btn btn-danger border-0 history-btn px-4 py-3 ms-auto">
                My History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(){
  const ipRequest = await fetch('http://ip-api.com/json/');
  const ipData = await ipRequest.json();
  const city = ipData.regionName;

  const api_key = "afebd9785505ed40d88667439f372dca";
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${api_key}&units=metric`;
  const weatherRequest = await fetch(url)
  const weatherInfo = await weatherRequest.json();

  console.log(weatherInfo);
  return {
    props: {weatherInfo, city}
  }

}

const saveWeather = () => {
  const date = new Date();

  let data = {
    date: `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
    time: date.toLocaleTimeString(),
    city: city,
    temperature: weatherInfo.main.temp,
    description: weatherInfo.weather[0].description,
  };

  let previousData = localStorage.getItem('weatherHistory');
  previousData = JSON.parse(previousData);
  if (previousData === null) {
    previousData = [];
  }
  previousData.push(data);
  localStorage.setItem('weatherHistory', JSON.stringify(previousData));
  alert('Weather saved successfully');
};