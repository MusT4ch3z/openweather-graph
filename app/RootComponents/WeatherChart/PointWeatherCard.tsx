import { format } from "date-fns/format";
import React, { useState } from "react";
import Image from "next/image";
import { Root } from "./type";

interface IPointWeatherCard {
  data: Root;
}

const imgUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;
const PointWeatherCard: React.FC<IPointWeatherCard> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const formattedDate = format(new Date(data.date), "dd MMM HH:mm");
  return (
    <div className="flex flex-col gap-3 w-80 p-4 rounded-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between">
        <div className="font-bold">{formattedDate}</div>
        <div className="font-bold mr-5">{data.city}</div>
      </div>
      <div className="flex justify-between">
        <div>
          <p>Temperature: {data.value.temp}°C</p>
          <p>Feels like: {data.value.feels_like}°C</p>
          <p>Humidity: {data.value.humidity}%</p>
          <p>Pressure: {data.value.pressure}hPa</p>
          <p>Wind: {data.value.wind.speed}m/s</p>
        </div>
        <div className="relative w-[120px] h-[120px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            width={120}
            height={120}
            src={imgUrl(data.value.weather[0].icon)}
            alt={data.value.weather[0].description}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default PointWeatherCard;
