export default function DashboardPage() {
  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>
          KSTS
        </h2>

        <p style={styles.brand}>
          Smart Travel Services
        </p>

        <nav>
          <p>🏠 Dashboard</p>
          <p>🏢 Companies</p>
          <p>🏪 Offices</p>
          <p>🚌 Buses</p>
          <p>🛣 Routes</p>
          <p>🎫 Bookings</p>
          <p>👥 Users</p>
          <p>⚙ Settings</p>
        </nav>
      </aside>


      {/* Main Area */}
      <main style={styles.main}>

        <header style={styles.header}>
          <h1>
            KSTS Super Admin Dashboard
          </h1>

          <div>
            Bilal Ahmed
            <br />
            <small>
              SUPER ADMIN
            </small>
          </div>
        </header>


        {/* Welcome */}
        <section style={styles.card}>
          <h2>
            Welcome Bilal Ahmed 👋
          </h2>

          <p>
            Karachi Smart Travel Services Management System
          </p>
        </section>


        {/* Stats */}
        <section style={styles.grid}>

          <div style={styles.stat}>
            <h3>0</h3>
            <p>Total Companies</p>
          </div>

          <div style={styles.stat}>
            <h3>0</h3>
            <p>Total Offices</p>
          </div>

          <div style={styles.stat}>
            <h3>0</h3>
            <p>Total Buses</p>
          </div>

          <div style={styles.stat}>
            <h3>0</h3>
            <p>Total Bookings</p>
          </div>

        </section>


        {/* Modules */}
        <section style={styles.card}>

          <h2>
            KSTS Modules
          </h2>

          <ul>
            <li>Bus Company Management</li>
            <li>Office Management</li>
            <li>Route Management</li>
            <li>Schedule Management</li>
            <li>Seat Booking System</li>
            <li>Ticket Management</li>
          </ul>

        </section>


      </main>

    </div>
  );
}



const styles = {

  container:{
    display:"flex",
    minHeight:"100vh",
    background:"#f5f7fb",
    fontFamily:"Arial"
  },

  sidebar:{
    width:"250px",
    background:"#111827",
    color:"white",
    padding:"25px"
  },

  logo:{
    fontSize:"38px",
    margin:0
  },

  brand:{
    color:"#9ca3af"
  },

  main:{
    flex:1,
    padding:"30px"
  },

  header:{
    display:"flex",
    justifyContent:"space-between",
    background:"white",
    padding:"20px",
    borderRadius:"12px"
  },

  card:{
    background:"white",
    marginTop:"25px",
    padding:"25px",
    borderRadius:"12px"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(4,1fr)",
    gap:"20px",
    marginTop:"25px"
  },

  stat:{
    background:"white",
    padding:"25px",
    borderRadius:"12px",
    textAlign:"center"
  }

};