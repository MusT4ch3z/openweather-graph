import { TWeatherParams } from "@/app/types/types";
import { format } from "date-fns";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

type TWeatherParamConfig = {
  value: string;
  unit: string;
};

type TWeatherParamsDictionary = {
  temperature: TWeatherParamConfig;
  humidity: TWeatherParamConfig;
  pressure: TWeatherParamConfig;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  paramToShow,
  paramDictionary,
}: TooltipProps<ValueType, NameType> & {
  paramToShow: TWeatherParams;
  paramDictionary: TWeatherParamsDictionary;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-semibold">
          {format(new Date(label), "dd MMM HH:mm")}
        </p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} ${paramDictionary[paramToShow].unit}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};
