import AdminLayout from './AdminLayout'
import Announcements from '../../components/Announcements'
import './AdminDashboard.css'

export default function AdminAnnouncements() {
  return (
    <AdminLayout activeSection="announcements" showHeader={false}>
      <div className="mgmt-container">
        <Announcements />
      </div>
    </AdminLayout>
  )
}
