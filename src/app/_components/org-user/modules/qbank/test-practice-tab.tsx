import { FC } from "react";
import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import TestModeForm from "./test-mode-form";

interface TestPracticeTabProps {}

const TestPracticeTab: FC<TestPracticeTabProps> = ({}) => {
  return (
    <div className="flex w-full items-center justify-center flex-col gap-6">
      <Tabs
        defaultValue="test"
        className="flex items-center justify-center w-full"
      >
        <TabsList className="min-w-[280px]">
          <TabsTrigger value="test" className="rounded-full">
            Test
          </TabsTrigger>
          <TabsTrigger value="practice" className="rounded-full">
            Practice
          </TabsTrigger>
        </TabsList>
        <TabsContent value="test" className="w-full">
          <div className="container">
            <TestModeForm />
          </div>
        </TabsContent>
        <TabsContent value="practice">
          <div className="w-24 h-24">
            <h3>Hello world...</h3>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestPracticeTab;
