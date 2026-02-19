import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} Dewflow. Built like production.
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a className="text-gray-700 hover:text-black" href="#services">
            Services
          </a>
          <a className="text-gray-700 hover:text-black" href="/engineering">
            Engineering
          </a>
          <a className="text-gray-700 hover:text-black" href="#contact">
            Contact
          </a>
        </div>
      </Container>
    </footer>
  );
}
