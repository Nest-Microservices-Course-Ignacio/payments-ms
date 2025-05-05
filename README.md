 ## Payment Service

# Dev


# Importante

será necesario correr el siguiente comando en local:
```
hookdeck listen 3000 stripe-localhost
```
NO CERRAR LA CONSOLA para poder usar el servicio de pago

para mas informacion https://dashboard.hookdeck.com/connections

## Build de Producción

Construir imagen de docker con el tag `:prod` y utilizando el `Dockerfile.prod`
ejemplo:
```
docker build -f Dockerfile.prod -t payments-ms:prod .
```