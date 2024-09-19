import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotAuthRedirect } from "../hooks/useNotAuthRedirect";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect } from "react";

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z
    .string()
    .min(8, "El DNI debe tener 8 caracteres")
    .max(8, "El DNI debe tener 8 caracteres")
    .regex(/^\d+$/, "El DNI solo debe contener números"),
  celular: z
    .string()
    .min(10, "El celular debe tener al menos 10 caracteres")
    .max(15, "El celular no debe exceder los 15 caracteres")
    .regex(/^\d+$/, "El celular solo debe contener números"),
  domicilio: z.string().min(5, "El domicilio debe tener al menos 5 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  factura: z.any().optional(), // Agregamos para validación opcional de archivos
  otraDocumentacion: z.any().optional(),
});

export const FormDenuncia = () => {
  useNotAuthRedirect();

  const nombreStored = localStorage.getItem("nombre") || "";
  const apellidoStored = localStorage.getItem("apel") || "";
  const dniStored = localStorage.getItem("dni") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  // const [facturaFile, setFacturaFile] = useState(null);
  // const [otraDocFile, setOtraDocFile] = useState(null);

  useEffect(() => {
    reset({
      nombre: nombreStored,
      apellido: apellidoStored,
      dni: dniStored,
    });
  }, [nombreStored, apellidoStored, dniStored, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        nombre: nombreStored,
        apel: apellidoStored,
        dni: dniStored,
        cel: data.celular,
        dom: data.domicilio,
        descripcion: data.descripcion,
        estado: "ABIERTO",
        factura: "www.google.com", // Valor hardcodeado
        otraDocumentacion: "", // Valor hardcodeado
      };
  
      const response = await fetch("http://localhost:4000/denuncias", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al enviar el formulario");
      }
  
      const result = await response.json();
      console.log(result);
      
      // Mostrar un alert y redirigir a /table
      alert("La denuncia se ha enviado correctamente.");
      navigate("/table");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };
  

  // const handleFileChange = (event, setFile) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFile(file);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl my-8"
      >
        <button
          type="button"
          onClick={() => navigate("/table")}
          className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white py-2 px-4 rounded-md hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-lg mb-6 flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" /> Volver al inicio
        </button>
        <h1 className="text-2xl font-semibold text-center mb-6">
          Formulario de Denuncia
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                {...register("nombre")}
                defaultValue={nombreStored}
                disabled
                className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none"
                placeholder="Nombre"
              />
              {errors.nombre && (
                <span className="text-red-500 text-sm">
                  {errors.nombre.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Apellido</label>
              <input
                {...register("apellido")}
                defaultValue={apellidoStored}
                disabled
                className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none"
                placeholder="Apellido"
              />
              {errors.apellido && (
                <span className="text-red-500 text-sm">
                  {errors.apellido.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">DNI</label>
              <input
                {...register("dni")}
                defaultValue={dniStored}
                disabled
                className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none"
                placeholder="DNI"
                type="text"
              />
              {errors.dni && (
                <span className="text-red-500 text-sm">
                  {errors.dni.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Teléfono</label>
              <input
                {...register("celular")}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de celular"
              />
              {errors.celular && (
                <span className="text-red-500 text-sm">
                  {errors.celular.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Domicilio</label>
              <input
                {...register("domicilio")}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Domicilio"
              />
              {errors.domicilio && (
                <span className="text-red-500 text-sm">
                  {errors.domicilio.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <div>
              <label className="block text-gray-700">Descripción</label>
              <textarea
                {...register("descripcion")}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción de la denuncia"
              />
              {errors.descripcion && (
                <span className="text-red-500 text-sm">
                  {errors.descripcion.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Ticket de compra/Factura</label>
              <input
                type="file"
                className="mt-1 w-full p-2"
              />
              {/* {facturaFile && (
                <p className="mt-2">Archivo seleccionado: {facturaFile.name}</p>
              )} */}
              {errors.factura && (
                <span className="text-red-500 text-sm">
                  {errors.factura.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Otra Documentación</label>
              <input
                type="file"
                className="mt-1 w-full p-2"
              />
              {/* {otraDocFile && (
                <p className="mt-2">Archivo seleccionado: {otraDocFile.name}</p>
              )} */}
              {errors.otraDocumentacion && (
                <span className="text-red-500 text-sm">
                  {errors.otraDocumentacion.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Enviar Denuncia
          </button>
        </div>
      </form>
    </div>
  );
};
