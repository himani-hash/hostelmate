"use client";
import * as React from "react";

import { format, subMonths } from "date-fns";
import { BadgeDollarSign, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";


type MenuType = {
  [day: string]: {
    [mealType: string]: string[];
  };
};

const lastMonth = format(subMonths(new Date(), 1), "LLLL");

export function OverviewCards() {

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [menu, setMenu] = React.useState<MenuType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState(today);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);

 React.useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/menu/1/2026-04-06`
      );
     
      const data = await res.json();
      setMenu(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchMenu();
}, []);

console.log("days=>", view)
  return (
  <div className="p-4 space-y-6">

    {/* 🔹 Days Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => (
        <div
          key={day}
          onClick={() => setView(day)}
          className="cursor-pointer transition-all"
        >
          <Card
            className={`text-center py-3 rounded-2xl border transition-all
            ${
              view === day
                ? "bg-black text-white dark:bg-white dark:text-black scale-105 shadow-lg"
                : "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <CardTitle className="text-sm">{day}</CardTitle>
          </Card>
        </div>
      ))}
    </div>

    {/* 🔹 Selected Day Menu */}
    <div>
      {menu && menu[view] ? (
        <Card className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-900 border dark:border-gray-700">
          
          <CardHeader>
            <CardTitle className="text-xl text-black dark:text-white">
              {view} Menu 
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Delicious meals planned for the day
            </CardDescription>
          </CardHeader>

          <CardContent className="grid sm:grid-cols-2 gap-4">
            {Object.entries(menu[view]).map(([mealType, items]) => (
              <div
                key={mealType}
                className="border rounded-xl p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              >
                <h3 className="font-semibold capitalize mb-2 text-gray-700 dark:text-gray-200">
                  {mealType}
                </h3>

                <ul className="list-disc ml-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {items.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>

        </Card>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No menu available for {view}
        </p>
      )}
    </div>

  </div>
);
}
