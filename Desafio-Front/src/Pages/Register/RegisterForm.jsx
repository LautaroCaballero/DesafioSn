import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

const registerSchema = z
  .object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    apel: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
    dni: z
      .string()
      .min(8, "El DNI debe tener 8 caracteres")
      .max(8, "El DNI debe tener 8 caracteres")
      .regex(/^\d+$/, "El DNI solo debe contener números"),
    email: z.string().email("Ingrese un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const RegisterForm = () => {
  useAuthRedirect();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const dataForm = {
        nombre: data.nombre,
        apel: data.apel,
        dni: data.dni,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      console.log(dataForm);

      const response = await fetch("http://localhost:4000/usuarios/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al registrar el usuario");
      }

      const result = await response.json();
      console.log(result);
      alert("Usuario registrado exitosamente");

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert(error.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-2 my-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">
          Registro de Usuario
        </h1>

        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            {...register("nombre")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Apellido</label>
          <input
            {...register("apel")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apellido"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.apel.message}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">DNI</label>
          <input
            {...register("dni")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="DNI"
            type="number"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.dni.message}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Correo Electrónico"
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

        <div>
          <label className="block text-gray-700">Confirmar Contraseña</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirmar Contraseña"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Registrar
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-700">
            Si ya estás registrado,{" "}
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={handleClick}
            >
              ingresa acá
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
};
