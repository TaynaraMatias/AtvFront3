const URL_API = "http://app.professordaniloalves.com.br";

/* MENU */
$('.scrollSuave').click(() => {
    $('html, body').animate(
        { scrollTop: $(event.target.getAttribute('href')).offset().top - 100 }, 500);
});


/* ENVIAR CADASTRO */

$("#cadastroDeAcordo").change(function(){
    $("#btnSubmitCadastro").attr("disabled", !this.checked);
});

const formularioCadastro = document.getElementById("formCadastro");
formularioCadastro.addEventListener("submit", enviarFormularioCadastro, true);

function enviarFormularioCadastro(event) {
    event.preventDefault();

        $("#formCadastro .invalid-feedback").remove();
        $("#formCadastro .is-invalid").removeClass("is-invalid");

        var metodo="PUT"
    
        if(document.getElementById("idCliente").value==""){
            metodo="POST"
        }
        fetch(URL_API + "/api/v1/cadastro", {
            method: metodo,
            headers: new Headers({
                Accept: "application/json",
                'Content-Type': "application/json",
            }),
            body: JSON.stringify({
                id:  document.getElementById("idCliente").value,
                nomeCompleto: document.getElementById("cadastroNomeCompleto").value,
                dataNascimento: document.getElementById("cadastroDataNascimento").value,
                sexo: document.querySelector("[name=cadastroSexo]:checked").value,
                cep: document.getElementById("cadastroCep").value.replace("-",""),
                cpf: document.getElementById("cadastroCpf").value.replaceAll(".","").replace("-",""),
                cidade: document.getElementById("cadastroCidade").value,
                uf: document.getElementById("cadastroUf").value,
                logradouro: document.getElementById("cadastroLogradouro").value,
                numeroLogradouro: document.getElementById("cadastroNumeroLogradouro").value,
                email: document.getElementById("cadastroEmail").value,
            })
        })
            .then(response => {
                return new Promise((myResolve, myReject) => {
                    response.json().then(json => {
                        myResolve({ "status": response.status, json });
                    });
                });
            }).then(response => {
                if (response && response.status===422 && response.json.errors) {
                    Object.entries(response.json.errors).forEach((obj, index) => {
                        const campo = obj[0];
                        const id = "cadastro" + campo.charAt(0).toUpperCase()+campo.substring(1);
                        const texto = obj[1][0];
                        criarDivDeCampoInvalido(id, texto, index == 0);
                    })
                }else if(response && response.json && response.json.message){
                    alert(response.json.message);
                }

                if(response.status===201 || response.status===200){
                    document.getElementById("idCliente").value=""
                    formCadastro.reset();
                    $("#cadastroDeAcordo").change();
                }
            }).catch(err => {
                $("#formCadastro").html("Ocorreu um erro ao realizar cadastro.");
                console.log(err);
        });
      
        }   
/* FIM ENVIAR CADASTRO */

/*Consultar pelo Cep */

function consultarCpf(){
    fetch(URL_API + "/api/v1/cadastro/"+$("#cadastroCpf").val().replaceAll(".","").replace("-",""),{
        method:"GET",
        headers: new Headers({
            Accept:"application/json"
        })
    })
    .then(response=>response.json())
    .then(response=>{
        if(response.id!=""){
            document.getElementById("idCliente").value=response.id
            document.getElementById("cadastroNomeCompleto").value=response.nomeCompleto
            document.getElementById("cadastroDataNascimento").value=response.dataNascimento
            document.querySelector("[name=cadastroSexo][value="+ response.sexo+"]").checked=true;
            document.getElementById("cadastroCep").value=response.cep;
            document.getElementById("cadastroCidade").value=response.cidade;
            document.getElementById("cadastroUf").value=response.uf;
            document.getElementById("cadastroLogradouro").value=response.logradouro;
            document.getElementById("cadastroNumeroLogradouro").value=response.numeroLogradouro;
            document.getElementById("cadastroEmail").value=response.email;
            document.getElementById("cadastroExpectativa").value=response.expectativa;
            $("#modalCadastro").modal("show");
        }
    })
     
}

function deletarConta(){
    fetch(URL_API + "/api/v1/cadastro/"+$("#cadastroCpf").val().replaceAll(".","").replace("-",""),{
        method:"DELETE",
        headers: new Headers({
            Accept:"application/json"
        })
    })
    .then(response=>{
     
        alert("Cadastro removido")
        formCadastro.reset();
        document.getElementById("idCliente").value=""
        $("#cadastroDeAcordo").change();
    })
}



/* CRIAR LISTA DE ESTADOS */

popularListaEstados();
function popularListaEstados() {
    fetch(URL_API + "/api/v1/endereco/estados", {
        method:"GET",
        headers: new Headers({
            Accept: "application/json"
            
        })
    })
    .then(response => {
        return response.json();
    }).then(estados => {
        const elSelecetUF = document.getElementById("cadastroUf");
        estados.forEach((estado) => {
            elSelecetUF.appendChild(criarOption(estado.uf, estado.nome));
        })
    }).catch(err => {
        alert("Erro ao salvar cadastro");
        console.log(err);
    })

}

function criarOption(valor, texto) {
    const node = document.createElement("option");
    const textnode = document.createTextNode(texto)
    node.appendChild(textnode);
    node.value = valor;
    return node;
}

/* FIM CRIAR LISTA DE ESTADOS */


/* PREENCHER ENDERE??O */

function popularEnderecoCadastro(){
 

    fetch(URL_API + "/api/v1/endereco/" + $("#cadastroCep").val(), {
        method:"GET",
        headers: new Headers({
            Accept: "application/json"
            
        })
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById("cadastroLogradouro").value = response.logradouro;
        document.getElementById("cadastroUf").value = response.uf;
        document.getElementById("cadastroCidade").value = response.localidade;
    });
  
}


    
/* FIM PREENCHER ENDERE??O */

/* IMC */

$('#btnCalcularIMC').click(() => {
    $("#resultadoIMC").html("");
    $("#formImc .invalid-feedback").remove();
    $("#formImc .is-invalid").removeClass("is-invalid");

    fetch(URL_API + "/api/v1/imc/calcular", {
        method: "POST",
        headers: new Headers({
            Accept: "application/json",
            'Content-Type': "application/json",
        }),
        body: JSON.stringify({
            peso: document.getElementById("pesoImc").value,
            altura: document.getElementById("alturaImc").value,
        })
    })
        .then(response => {
            return new Promise((myResolve, myReject) => {
                response.json().then(json => {
                    myResolve({ "status": response.status, json });
                });
            });
        }).then(response => {
            if (response && response.json.errors) {
                Object.entries(response.json.errors).forEach((obj, index) => {
                    const id = parseIdImc(obj[0]);
                    const texto = obj[1][0];
                    criarDivDeCampoInvalido(id, texto, index == 0);
                })
            } else {
                $("#resultadoIMC").html(response.json.message);
                $('#modalResultadoIMC').modal('show');
            }
        }).catch(err => {
            $("#resultadoIMC").html("Ocorreu um erro ao tentar calcular seu IMC.");
            $('#modalResultadoIMC').modal('show');
            console.log(err);
    });

});

function parseIdImc(id) {
    return id + "Imc";
}


/* FIM IMC */

function criarDivDeCampoInvalido(idItem, textoErro, isFocarNoCampo) {
    const el = document.getElementById(idItem);
    isFocarNoCampo && el.focus();
    el.classList.add("is-invalid");
    const node = document.createElement("div");
    const textnode = document.createTextNode(textoErro);
    node.appendChild(textnode);
    const elDiv = el.parentElement.appendChild(node);
    elDiv.classList.add("invalid-feedback");
}