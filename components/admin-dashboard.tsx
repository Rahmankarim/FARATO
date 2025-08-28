import { AdminEmails } from "./admin-emails"

const AdminDashboard = ({ section }: { section: string }) => {
  switch (section) {
    case "emails":
      return <AdminEmails />
    //** rest of code here **/
    default:
      return <div>Unknown section</div>
  }
}

export default AdminDashboard
