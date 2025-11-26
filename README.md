## Clone este repositório:

```
git clone https://github.com/EduardoSilvaS/Encurtador-de-link
```  

```
cd Encurtador-de-link
```

Suba a VM com Vagrant:

```
vagrant up
```

## Estabeleça a sessão do SSH

### Na VM-PROXY
```
vagrant ssh proxy
```


### Na VM-APP
```
vagrant ssh app
```


### Na VM-DB
```
vagrant ssh db
```

## Desligando as interfaces NAT (enp0s3) em cada VM

### Na VM-APP
```
sudo ip link set enp03 down
```

### Na VM-DB
```
sudo ip link set enp03 down
```

## Acesse o APP

> [192.168.56.10](http://192.168.56.10)

## Uso com Docker (substitui Vagrant/VMs)

Siga estes passos para rodar a aplicação em containers usando Docker Compose.

- Construa e suba os serviços:

```powershell
docker compose up --build
```

- A aplicação ficará disponível em `http://localhost:3000` (mapeada para a porta 3000).

- Parar e remover containers (mantém dados do banco em volume):

```powershell
docker compose down
```

- Para remover também os dados do Postgres (volume):

```powershell
docker compose down -v
```

Observações:
- O `docker-compose.yml` cria dois serviços: `db` (Postgres 14) e `app` (Node). As variáveis de conexão são passadas via `environment` no `docker-compose.yml`.
- Se preferir manter variáveis em arquivo `.env`, crie um `.env` local e ajuste `docker-compose.yml` para usar `env_file`.
- O `Vagrantfile` continua no repositório apenas para referência. Quando estiver satisfeito com a migração, você pode removê-lo.
