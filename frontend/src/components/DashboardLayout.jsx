export default function DashboardLayout({ children, className = "" }) {
  const classes = ["dashboard", className].filter(Boolean).join(" ");

  return <main className={classes}>{children}</main>;
}