import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

const loginSchema = z.object({
  email: z.string().email("Ingrese un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const LoginForm = () => {
  useAuthRedirect();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/register");
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:4000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("dni", result.user.dni);
        localStorage.setItem("nombre", result.user.nombre);
        localStorage.setItem("apel", result.user.apel);
        alert("Login exitoso");
        navigate("/table");
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-2 my-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">
          Iniciar Sesión
        </h1>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            {...register("email")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contraseña"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Ingresar
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-700">
            Si aún no tienes un usuario,{" "}
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={handleClick}
            >
              regístrate aquí
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
};
