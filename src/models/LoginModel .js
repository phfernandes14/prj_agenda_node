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

  async register() {
    this.valida();
    if (this.errors.length > 0) {
      return
    }


    await this.userExists()

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt)





    try {

      this.user = await LoginModel.create(this.body)


    } catch (error) {
      console.log(error)
    }
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if (user) this.errors.push('Email ja cadastrado')
  }

  valida() {
    //Validacao
    this.cleanUp()
    //Valida email
    !validator.isEmail(this.body.email) ? this.errors.push('Email invalido') : null
    //Valida senha
    this.body.password.length < 3 || this.body.password > 50
      ? this.errors.push('A senha precisa ter entre 3 e 50 caracteres') : null

  }

  //Checa se os atributos no body são strings 
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };


  }
}

module.exports = Login;
