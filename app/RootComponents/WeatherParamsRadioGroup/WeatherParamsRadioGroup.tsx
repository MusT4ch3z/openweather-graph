import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TWeatherParams } from "@/app/types/types";
import { Slider } from "@/components/ui/slider";

interface IWeatherParamsRadioGroup {
  value: TWeatherParams;
  onChange: (value: TWeatherParams) => void;
  setForecastRange: (value: number) => void;
}
const WeatherParamsRadioGroup: React.FC<IWeatherParamsRadioGroup> = ({
  value,
  onChange,
  setForecastRange,
}) => {
  const weatherParams = ["temperature", "humidity", "pressure"];
  return (
    <div className="flex flex-col gap-3">
      <label className="text-base h-[17.6px] font-semibold">
        Display parameter for the chart
      </label>
      <div className="flex flex-col gap-3">
        <label className="text-base h-4">Weather forecast range</label>
        <Slider
          defaultValue={[5]}
          min={1}
          max={5}
          step={1}
          onValueCommit={(value) => {
            setForecastRange(value[0]);
          }}
          className="w-full h-[4px] bg-gray-200 rounded-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>1</span>
          <span>5</span>
        </div>
      </div>
      <RadioGroup value={value} onValueChange={onChange}>
        {weatherParams.map((param) => (
          <div className="flex items-center space-x-2" key={param}>
            <RadioGroupItem value={param} id={param} />
            <Label
              htmlFor={param}
              className="flex self-end capitalize cursor-pointer"
            >
              {param}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default WeatherParamsRadioGroup;
