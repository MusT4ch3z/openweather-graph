"use client";

import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { format } from "date-fns";
import { DynamicChartData, TWeatherParams } from "@/app/types/types";
import { getRandomColor } from "@/lib/utils";
import PointWeatherCard from "./PointWeatherCard";
import { Root } from "./type";
import { CustomTooltip } from "./CustomTooltip";

interface IWeatherChart {
  data: DynamicChartData[];
  cities: string[] | undefined;
  paramToShow: TWeatherParams;
  forecastRange: number;
}

const WeatherChart: React.FC<IWeatherChart> = ({
  data,
  cities,
  paramToShow,
  forecastRange,
}) => {
  const [cityColors, setCityColors] = useState<Record<string, string>>({});
  const [pointData, setPointData] = useState<Root | null>(null);
  const paramDictionary = {
    temperature: { value: "temp", unit: "°C" },
    humidity: { value: "humidity", unit: "%" },
    pressure: { value: "pressure", unit: "hPa" },
  };

  // Generate a random color for each city. Doesn't triggers on re-render
  useEffect(() => {
    if (cities) {
      const newCities = cities.filter((city) => !cityColors[city]);
      if (newCities.length > 0) {
        setCityColors((prevColors) => {
          const newColors = { ...prevColors };
          newCities.forEach((city) => {
            newColors[city] = getRandomColor();
          });
          return newColors;
        });
      }
    }
  }, [cities, cityColors]);

  const filterDataByRange = (
    data: DynamicChartData[],
    range: number
  ): DynamicChartData[] => {
    const pointsPerDay = 8;
    const maxPoints = range * pointsPerDay + 1;
    return data.slice(0, maxPoints);
  };

  const filteredData = filterDataByRange(data, forecastRange);

  const renderChart = () => {
    return cities!.map((city: string) => (
      <Line
        key={city}
        type="monotone"
        name={city}
        dataKey={`${city}.${paramDictionary[paramToShow].value}`}
        stroke={cityColors[city]}
        activeDot={{
          onMouseOver: ((
            e: React.MouseEvent<SVGElement, MouseEvent>,
            payload: { payload: DynamicChartData }
          ) => {
            const pointData = payload.payload;
            const currentCityData: Root = {
              city: city,
              date: pointData.date,
              value: pointData[city],
            };
            setPointData(currentCityData);
          }) as MouseEventHandler<SVGElement>,
        }}
      />
    ));
  };

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <LineChart
        width={730}
        height={250}
        data={filteredData}
        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), "dd MMM HH:mm")}
        />
        <YAxis
          label={{
            value: paramToShow,
            position: "top",
            offset: 12,
            style: {
              textTransform: "capitalize",
            },
          }}
          unit={paramDictionary[paramToShow].unit}
        />
        <Tooltip
          content={
            <CustomTooltip
              paramToShow={paramToShow}
              paramDictionary={paramDictionary}
            />
          }
        />
        <Legend />
        {renderChart()}
      </LineChart>
      {pointData && <PointWeatherCard data={pointData} />}
    </div>
  );
};

export default WeatherChart;
