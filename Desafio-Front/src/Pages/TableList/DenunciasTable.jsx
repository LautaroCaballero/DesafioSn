import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useNotAuthRedirect } from "../../hooks/useNotAuthRedirect";

const columns = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apel",
    header: "Apellido",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
];

const DenunciasTable = () => {
  useNotAuthRedirect();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dniLocalStorage = localStorage.getItem("dni");

  useEffect(() => {
    const fetchDenuncias = async () => {
      setLoading(true);
      try {
        const dni = localStorage.getItem("dni");
        if (!dni) {
          throw new Error("No se encontró el DNI");
        }

        let url = `http://localhost:4000/denuncias`;
        if (dni !== "41567705") {
          url = `http://localhost:4000/denuncias/${dni}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener las denuncias");
        }

        const result = await response.json();
        setData(Array.isArray(result) ? result : [result]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDenuncias();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dni");
    localStorage.removeItem("nombre");
    localStorage.removeItem("apel");
    navigate("/login");
  };

  const updateEstado = async (id, nuevoEstado) => {
    try {
      if (!id || !nuevoEstado) {
        throw new Error("ID o estado no proporcionado");
      }

      const response = await fetch(`http://localhost:4000/denuncias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al actualizar el estado: ${errorMessage}`);
      }

      const updatedDenuncia = await response.json();
      console.log("Denuncia actualizada:", updatedDenuncia);

      setData((prevData) =>
        prevData.map((denuncia) =>
          denuncia.id === id ? { ...denuncia, estado: nuevoEstado } : denuncia
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl my-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Lista de Denuncias
        </h1>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-md hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg mb-6 mr-4"
        >
          Cerrar Sesión
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white py-2 px-4 rounded-md hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-lg mb-6"
        >
          Generar denuncia
        </button>

        {loading ? (
          <div className="text-center">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border p-4 text-left text-gray-700 font-semibold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="even:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border p-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                      {dniLocalStorage === "41567705" && (
                        <td className="border p-4">
                          <select
                            value={row.original.estado}
                            onChange={(e) =>
                              updateEstado(row.original.id, e.target.value)
                            }
                            className="border p-2"
                          >
                            <option value="ABIERTO">ABIERTO</option>
                            <option value="EN REVISION">EN REVISION</option>
                            <option value="CERRADO">CERRADO</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-4">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DenunciasTable;
