const UsersTable = ({ users, currentUserRole, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr className="bg-[#272C7D] text-white">
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Nomor HP</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                Tidak ada pengguna.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.nomorHp}</td>
                <td className="py-2 px-4 capitalize">{user.role}</td>
<td className="py-2 px-4 space-x-1 sm:space-x-2 flex">
  {(currentUserRole === "superadmin" ||
    (currentUserRole === "admin" && user.role === "user")) && (
    <button
      onClick={() => onEdit(user)}
      className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-2 bg-[#588157] text-white rounded hover:bg-[#a3b18a] text-xs sm:text-sm w-[80px]"
    >
      Edit
    </button>
  )}

  <button
    onClick={() => onDelete(user.id)}
    className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm w-[80px]"
  >
    Hapus
  </button>
</td>


              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
