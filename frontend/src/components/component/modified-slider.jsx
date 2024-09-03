"use client"

import { Slider } from "@/components/ui/slider"

export function ModifiedSlider({ value, onChange }) {
    return (
        <div className="flex gap-4">
            <Slider
                defaultValue={[value]}
                min={3}
                max={16}
                step={1}
                className="w-[60%]"
                onValueChange={(val) => onChange(val[0])}
            />
            <div className="font-medium">{value}</div>
        </div>
    );
}
