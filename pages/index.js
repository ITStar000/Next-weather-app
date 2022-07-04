import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home({ weatherInfo, city }) {
  // Get current date and time
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const saveWeather = () => {
    const date = new Date();

    let data = {
      date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      time: date.toLocaleTimeString(),
      city: city,
      temperature: weatherInfo.main.temp,
      description: weatherInfo.weather[0].description,
    };

    // Jan 1st 1970 00:00:00, Lagos temperature was 25°C, and the weather was clear.
    let previousData = localStorage.getItem("weatherHistory");
    previousData = JSON.parse(previousData);
    if (previousData === null) {
      previousData = [];
    }
    previousData.push(data);
    localStorage.setItem("weatherHistory", JSON.stringify(previousData));
    alert("Weather saved successfully");
  };

  return (
    <div>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div>
          <div>
            <h1 className="fw-bolder" style={{ fontSize: "60px" }}>
              {`${weatherInfo.name}, ${weatherInfo.sys.country}`}
            </h1>
            {day + " " + month + ", " + year}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="pe-5">
              <h2 className="d-inline">{Math.round(weatherInfo.main.temp)}</h2>
              <sup>°C</sup>
              <p className="text-info text-capitalize">
                {weatherInfo.weather[0].description}
              </p>
            </div>
            <div>
              <img
                src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`}
                alt=""
              />
            </div>
          </div>
          <hr />
          {/* create button group */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              onClick={saveWeather}
              className="btn btn-success border-0 save-btn px-4 py-3"
            >
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
  );
}

export async function getServerSideProps() {
  const ipRequest = await fetch(`http://ip-api.com/json/`);
  const ipData = await ipRequest.json();
  const city = "Lagos";

  const api_key = process.env.API_KEY;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${api_key}&units=metric`;
  const weatherRequest = await fetch(url);
  const weatherInfo = await weatherRequest.json();

  console.log(city);
  return { props: { weatherInfo, city } };
}