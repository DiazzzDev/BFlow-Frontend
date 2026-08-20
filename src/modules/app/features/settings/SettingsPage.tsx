import { useState } from "react";
import { CustomModal } from "@/components/custom/CustomModal";
import { Pencil } from "lucide-react";

export const SettingsPage = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Estados locales del perfil
  const [fullName, setFullName] = useState("Edwin Díaz");
  const [email, setEmail] = useState("ed.diaz.hz@gmail.com");
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/150");

  // Estado local para agregar categorías en el modal
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([
    "Alimentos",
    "Transporte",
    "Servicios",
  ]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para guardar en backend
    setIsProfileModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 flex flex-col gap-6">

      {/* Tarjeta de Perfil Estilo Google */}
      <div className="relative flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-4">
          <img
            src={avatarUrl}
            alt="Foto de perfil"
            className="h-28 w-28 rounded-full border-2 border-surface-hard object-cover"
          />
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="absolute bottom-0 right-0 rounded-full border border-light-10 bg-secondary p-2 text-light transition-colors hover:bg-secondary-dark active:scale-95"
            title="Editar perfil"
          >
            <Pencil height={15} width={15} />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-light">{fullName}</h2>
        <p className="text-sm text-label">{email}</p>
      </div>

      {/* Card: Gestión de Categorías */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-light-10 bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-medium text-light">Categorías</h3>
          <p className="text-sm text-label">
            Administra las categorías de tus movimientos financieros
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCategoryModalOpen(true)}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-light transition-colors hover:bg-primary-dark active:scale-95"
        >
          Gestionar Categorías
        </button>
      </div>

      {/* Card Concepto: Cerrar Sesión */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-danger-25 bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-medium text-danger">Cerrar sesión</h3>
          <p className="text-sm text-label">
            Cierra tu sesión activa en esta aplicación
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-danger/50 px-5 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-sweet active:scale-95"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Modal Editar Perfil */}
      <CustomModal
        isModalOpen={isProfileModalOpen}
        setIsModalOpen={setIsProfileModalOpen}
        title="Editar Perfil"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-label">
              URL de la foto
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light placeholder:text-placeholder focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-label">
              Nombre completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light placeholder:text-placeholder focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-label">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light placeholder:text-placeholder focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="rounded-lg border border-light-10 bg-secondary px-4 py-2 text-sm font-medium text-light hover:bg-secondary-dark"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-light hover:bg-primary-dark"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Modal CRUD Categorías */}
      <CustomModal
        isModalOpen={isCategoryModalOpen}
        setIsModalOpen={setIsCategoryModalOpen}
        title="Administrar Categorías"
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col gap-5">
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría..."
              className="w-full rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light placeholder:text-placeholder focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg bg-success px-4 py-2 text-sm font-medium text-light hover:bg-success-dark"
            >
              Agregar
            </button>
          </form>

          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-light-5 bg-surface-hard p-3"
              >
                <span className="text-sm text-light">{cat}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(idx)}
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-light hover:bg-secondary-dark"
            >
              Cerrar
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};