"use client"

import { useState } from "react"
import { Mail } from "lucide-react"

const AdminSidebar = () => {
  const [activeSection, setActiveSection] = useState("dashboard")

  const navigation = [
    {
      title: "Dashboard",
      icon: "DashboardIcon",
      href: "#",
      onClick: () => setActiveSection("dashboard"),
      isActive: activeSection === "dashboard",
    },
    {
      title: "Email Marketing",
      icon: Mail,
      href: "#",
      onClick: () => setActiveSection("emails"),
      isActive: activeSection === "emails",
    },
    //** rest of code here **
  ]

  return (
    <div>
      {navigation.map((item) => (
        <div key={item.title} onClick={item.onClick} className={`nav-item ${item.isActive ? "active" : ""}`}>
          {item.icon}
          {item.title}
        </div>
      ))}
    </div>
  )
}

export default AdminSidebar
