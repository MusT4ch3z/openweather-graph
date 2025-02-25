"use client";

import CityInput from "./RootComponents/CityInput/CityInput";
import axios from "axios";
import WeatherChart from "./RootComponents/WeatherChart/WeatherChart";
import { useState } from "react";
import { DynamicChartData, IList, TWeatherParams } from "./types/types";
import WeatherParamsRadioGroup from "./RootComponents/WeatherParamsRadioGroup/WeatherParamsRadioGroup";
import CitiesList from "./RootComponents/CitiesList/CitiesList";
import ApiKeyDialog from "./RootComponents/ApiKeyInput/ApiKeyInput";
import ServiceDescription from "./RootComponents/ServiceDescription/ServiceDescription";

export default function Root() {
  const [data, setData] = useState<DynamicChartData[] | undefined>();
  const [selectedParam, setSelectedParam] =
    useState<TWeatherParams>("temperature");
  const [forecastRange, setForecastRange] = useState(5);
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey"));

  const cities = data?.[0]
    ? Object.keys(data[0]).filter((key) => key !== "date")
    : [];
  const getCityGeoUrl = (city: string) =>
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  const getWeatherUrl = (lat: number, lon: number) =>
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const hideCitiesOnChart = (citiesToHide: string[]) => {
    setData((prev) =>
      prev!.map((item) => {
        const newItem = { ...item };
        citiesToHide.forEach((city) => {
          delete newItem[city];
        });
        return newItem;
      })
    );
  };

  const getWeather = async (city: string) => {
    try {
      //Get geo coordinates of the city
      const response = await axios.get(getCityGeoUrl(city));
      if (response.data) {
        try {
          getWeatherInfo(response.data[0].lat, response.data[0].lon);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Get weather via coordinates
  const getWeatherInfo = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(getWeatherUrl(lat, lon));
      if (response.data) {
        const newData = response.data.list.map((i: IList) => ({
          date: i.dt_txt,
          [response.data.city.name]: {
            ...i.main,
            weather: i.weather,
            wind: i.wind,
          },
        }));

        setData((prev) => {
          if (!prev) return newData;

          return prev.map((item, idx) => ({
            ...item,
            ...newData[idx],
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWeatherParamChange = (value: TWeatherParams) => {
    setSelectedParam(value);
  };

  return (
    <>
      <header className="text-4xl font-bold text-center mt-8 mb-4">
        OpenWeather Graph
      </header>
      {apiKey ? (
        <div className="flex mt-10 gap-20">
          <div className="flex flex-col gap-10">
            <CityInput onSubmitCity={getWeather} />
            <WeatherParamsRadioGroup
              value={selectedParam}
              onChange={handleWeatherParamChange}
              setForecastRange={setForecastRange}
            />
            {cities[0] && (
              <CitiesList
                cities={cities}
                hideCitiesOnChart={hideCitiesOnChart}
                clearData={() => setData(undefined)}
              />
            )}
          </div>
          {data && cities[0] ? (
            <WeatherChart
              data={data}
              cities={cities}
              paramToShow={selectedParam}
              forecastRange={forecastRange}
            />
          ) : (
            <ServiceDescription />
          )}
        </div>
      ) : (
        <ApiKeyDialog setApiKey={setApiKey} />
      )}
    </>
  );
}
