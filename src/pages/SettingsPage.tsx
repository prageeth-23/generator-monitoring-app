import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Alert Thresholds</CardTitle>
            <CardDescription>Configure when on-site buzzer & LED alerts are triggered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fuel-warn">Fuel Warning (%)</Label>
                <Input id="fuel-warn" type="number" defaultValue={25} />
              </div>
              <div>
                <Label htmlFor="fuel-crit">Fuel Critical (%)</Label>
                <Input id="fuel-crit" type="number" defaultValue={15} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volt-warn">Voltage Warning (V)</Label>
                <Input id="volt-warn" type="number" defaultValue={215} />
              </div>
              <div>
                <Label htmlFor="volt-crit">Voltage Critical (V)</Label>
                <Input id="volt-crit" type="number" defaultValue={210} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vib-warn">Vibration Warning (g)</Label>
                <Input id="vib-warn" type="number" defaultValue={3} step={0.1} />
              </div>
              <div>
                <Label htmlFor="vib-crit">Vibration Critical (g)</Label>
                <Input id="vib-crit" type="number" defaultValue={4} step={0.1} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="curr-warn">Current Warning (A)</Label>
                <Input id="curr-warn" type="number" defaultValue={30} />
              </div>
              <div>
                <Label htmlFor="curr-crit">Current Critical (A)</Label>
                <Input id="curr-crit" type="number" defaultValue={50} />
              </div>
            </div>
            <Button>Save Thresholds</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Notifications</CardTitle>
            <CardDescription>Choose how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Critical Alerts Only</Label>
                <p className="text-xs text-muted-foreground">Only notify for critical events</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Alerts</Label>
                <p className="text-xs text-muted-foreground">Play a sound for new alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">ESP32 Connection</CardTitle>
            <CardDescription>Configure your NodeMCU ESP32 WiFi connection to Firebase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="device-id">Device ID</Label>
              <Input id="device-id" defaultValue="ESP32-GEN-001" />
            </div>
            <div>
              <Label htmlFor="firebase-url">Firebase Realtime DB URL</Label>
              <Input id="firebase-url" defaultValue="https://generator-monitoring-sys-41355-default-rtdb.firebaseio.com" readOnly className="text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="poll-interval">Data Poll Interval (seconds)</Label>
              <Input id="poll-interval" type="number" defaultValue={5} />
            </div>
            <Button>Update Connection</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
