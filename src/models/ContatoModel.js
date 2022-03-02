const mongoose = require('mongoose');
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
  
  nome:{type: String, required: true},
  sobrenome:{type: String, required: false, default: ''},
  email:{type: String, required: false, default: false},
  telefone:{type: String, required: false, default:''},
  criadoEm: {type: Date, default: Date.now}



});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }



   static async buscaPorId(id) {
    if (typeof id !== 'string') {
        return
    } else {
        const user = await ContatoModel.findById(id);
        return user;
    }

}

  async register(){
    this.valida();
    if(this.errors.length > 0 ){
      return
    }else{
      this.contato = await ContatoModel.create(this.body)
    } 
   }

  //Método que valida dados req.body
  valida() {
    //Validação
    this.cleanUp()
    this.body.email && !validator.isEmail(this.body.email) ? this.errors.push('E-mail invalido') : null;
    !this.body.nome ? this.errors.push('Nome é um campo obrigatório') : null;
    !this.body.email && !this.body.telefone ? this.errors.push('Você precisa inserir um e-mail ou telefone') : null
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
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone
    }
  }
  


  
}

module.exports = Contato;
