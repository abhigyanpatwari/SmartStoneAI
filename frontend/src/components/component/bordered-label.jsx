import { Label } from "@/components/ui/label"

export function BorderedLabel({ value }) {
    return (
        <div>
            <div className="grid space-x-2">
                <div className="border rounded-md px-3 py-2">
                    <Label htmlFor="terms">{value}</Label>
                </div>
            </div>
        </div>
    );
}
