import { Container, Nav, Navbar } from 'react-bootstrap'

export const BarraMenu = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container>
      <Navbar.Brand href="#home">ABM PRODUCTOS</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/productos">Productos</Nav.Link>
        <Nav.Link href="/ingredientes">Ingredientes</Nav.Link>
        <Nav.Link href="/categorias">Categorias</Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  )
}
