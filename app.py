from flask import Flask, render_template, request, redirect, flash, url_for, session, jsonify
import logging
import pymysql

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui'

# Configurações do banco de dados MySQL
db_host = 'database-1.cncey82muxw0.us-east-2.rds.amazonaws.com'
db_user = 'admin'
db_password = '87654321ab'
db_name = 'loja'


# Configuração do logger
logging.basicConfig(level=logging.INFO)

# Função para conectar ao banco de dados
def conectar_bd():
    try:
        conn = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        return conn
    except pymysql.Error as e:
        logging.error("Erro ao conectar-se ao banco de dados: %s", str(e))
        return None

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para a página de cadastro
@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

# Rota para cadastrar
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    if request.method == 'POST':
        nome_usuario = request.form['nome_usuario']
        email = request.form['email']
        senha = request.form['senha']

        conn = conectar_bd()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("INSERT INTO usuarios (nome_usuario, email, senha) VALUES (%s, %s, %s)", (nome_usuario, email, senha))
                conn.commit()
                cursor.close()
                conn.close()
                return 'Cadastro realizado com sucesso!'
            except pymysql.Error as e:
                logging.error("Erro ao cadastrar usuário: %s", str(e))
                return 'Erro ao cadastrar usuário. Por favor, tente novamente.'
        else:
            return 'Erro ao conectar-se ao banco de dados.'
        

# Rota para a página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']

        
        conn = conectar_bd()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM usuarios WHERE email = %s AND senha = %s", (email, senha))
                usuario = cursor.fetchone()
                cursor.close()
                if usuario:
                    session['logged_in'] = True
                    session['user_id'] = usuario[0] 
                    session['nome_usuario'] = usuario[1]  
                    return redirect(url_for('index'))
                else:
                    flash('Credenciais inválidas. Tente novamente.', 'error')
                    return redirect(url_for('login'))
            except pymysql.Error as e:
                logging.error("Erro ao executar a consulta no banco de dados: %s", str(e))
                return 'Erro ao autenticar usuário. Por favor, tente novamente.'
        else:
            return 'Erro ao conectar-se ao banco de dados.'

    return render_template('login.html')



# Rota para a página de contato
@app.route('/contato')
def contato():
    return render_template('contato.html')



# Rota para a página sobre
@app.route('/sobre')
def sobre():
    return render_template('sobre.html')


if __name__ == '__main__':
    app.run(debug=True)
