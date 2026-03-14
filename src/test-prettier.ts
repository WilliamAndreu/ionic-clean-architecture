// Archivo de prueba con FORMATO HORRIBLE
export class TestComponent {
  constructor(private service: unknown) {}
  getUserData() {
    const user = { name: 'John', age: 30, email: 'test@example.com' };
    return user;
  }
}
