export const querys = {
    getAllDenuncias: 'SELECT id, nombre, apel, dni, descripcion, estado FROM denuncias',
    createNewDenuncia: 'INSERT INTO denuncias (nombre, apel, dni, cel, dom, descripcion, estado, ticket_url, otros_url) VALUES (@nombre, @apel, @dni, @cel, @dom, @descripcion, @estado, @ticket_url, @otros_url)',
    getDenunciaByDNI: 'SELECT id, nombre, apel, dni, descripcion, estado FROM Denuncias WHERE dni = @dni',
    updateDenuncia: 'UPDATE denuncias SET nombre = @nombre, apel = @apel, dni = @dni, cel = @cel, dom = @dom, descripcion = @descripcion, estado = @estado, ticket_url = @ticket_url, otros_url = @otros_url WHERE Id = @id'
}