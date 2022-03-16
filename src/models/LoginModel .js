const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  //Método para logar
  async login() {
    //Chama validaçõe de dados
    this.valida();
    //Retorna validações de dados
    if (this.errors.length > 0) {
      return
    }

    this.user = await LoginModel.findOne({ email: this.body.email })

    if (!this.user) {
      this.errors.push('Usuário não existe.')
      return
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Email ou senha invalidos')
    }

  }

  //Método que registra usuário na base de daods
  async register() {
    //Chama validações de dados
    this.valida();

    //Retorna validações
    if (this.errors.length > 0) {
      return
    }

    //Checa se usuário existe
    await this.userExists()

    //Cria hash de senha
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    try {
      this.user = await LoginModel.create(this.body)
    } catch (error) {
      console.log(error)
    }
  }

  //Método que checa se já usuário na base de dados
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email })
    if (this.user) this.errors.push('Email ja cadastrado')
  }

  //Método que valida dados req.body
  valida() {
    //Validação
    this.cleanUp()
    //Valida email
    !validator.isEmail(this.body.email) ? this.errors.push('Email invalido') : null
    //Valida senha
    this.body.password.length < 3 || this.body.password > 50
      ? this.errors.push('A senha precisa ter entre 3 e 50 caracteres') : null
  }

  //Metodo que checa se os atributos no body são strings 
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    //Filtra req.body
    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;
