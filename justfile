set shell := ["zsh", "-i", "-c"]

# Muestra los comandos disponibles
default:
    @just --list

# Instala dependencias y configura el proyecto
setup:
    nvm install
    npm install

# Ejecuta los tests
test:
    npm test

# Ejecuta los tests con coverage
coverage:
    npm test -- --configuration coverage

# Ejecuta el linter
lint:
    npm run lint

# Formatea el código
format:
    npm run format

# Genera el proyecto nativo de Android (solo la primera vez)
add-android:
    npx cap add android

# Genera el proyecto nativo de iOS (solo la primera vez)
add-ios:
    npx cap add ios

# Compila la web y sincroniza con los proyectos nativos
sync:
    npm run build && npx cap sync

# Abre el proyecto nativo en Android Studio
android:
    just sync && npx cap open android

# Abre el proyecto nativo en Xcode
ios:
    just sync && npx cap open ios
