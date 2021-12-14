
const numberValidator = async (value) => {

    const parameter = Number(value);

    if(isNaN(parameter) || parameter < 0) {
        throw new Error('Ingresa un valor válido');
    }
}



module.exports = numberValidator;