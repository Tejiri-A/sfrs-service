import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "../ui/card.tsx";
import type { ReactNode } from "react";

interface AuthContainerProps {
  title:string,
  description:string,
  children:ReactNode,
}

const AuthContainer = ({title,description,children}: AuthContainerProps) => {
  return (
    <div className={`min-h-screen flex items-center justify-center`}>
      <Card className={`xl:w-1/4 md:w-1/2 shadow-md`}>
        <CardHeader className={`space-y-1`}>
          <CardTitle className={`text-2xl`}>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
export default AuthContainer;
