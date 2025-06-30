class MockFirebase {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  async signUp(email, password, userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (this.users.find(user => user.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
    
    const userResponse = { ...newUser };
    delete userResponse.password;
    return userResponse;
  }

  async signIn(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const userResponse = { ...user };
    delete userResponse.password;
    this.currentUser = userResponse;
    localStorage.setItem('currentUser', JSON.stringify(userResponse));
    
    return userResponse;
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

const firebase = new MockFirebase();
export default firebase;