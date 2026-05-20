import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PowerGaugeProps {
  voltage: number;
  current: number;
  power: number;
}

export function PowerGauge({ voltage, current, power }: PowerGaugeProps) {
  const maxPower = 6;
  const percentage = Math.min((power / maxPower) * 100, 100);
  const circumference = 2 * Math.PI * 60;
  const dashOffset = circumference - (percentage / 100) * circumference * 0.75;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-sm font-medium">Power Output</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-40 h-32">
          <svg viewBox="0 0 140 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 15 85 A 60 60 0 0 1 125 85"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d="M 15 85 A 60 60 0 0 1 125 85"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 1.7} 200`}
            />
            <text x="70" y="65" textAnchor="middle" className="fill-foreground font-heading text-2xl font-bold" fontSize="24">
              {power}
            </text>
            <text x="70" y="82" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
              kW
            </text>
          </svg>
        </div>
        <div className="flex gap-6 mt-2 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Voltage</p>
            <p className="font-medium">{voltage}V</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Current</p>
            <p className="font-medium">{current}A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
