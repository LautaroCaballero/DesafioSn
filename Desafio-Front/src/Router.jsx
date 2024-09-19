import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./ui/Layout.ui";
import {FormDenuncia} from "./Pages/FormDenuncia";
import { LoginForm } from "./Pages/Login/LoginForm";
import { RegisterForm } from "./Pages/Register/RegisterForm";
import DenunciasTable from "./Pages/TableList/DenunciasTable";

export const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                element: <LoginForm />,
                path: "/"
            },
            {
                element: <FormDenuncia />,
                path:"/form"
            },
            {
                element: <RegisterForm />,
                path:"/register"
            },
            {
                element: <DenunciasTable />,
                path: "/table"
            }
        ]
    }
])
