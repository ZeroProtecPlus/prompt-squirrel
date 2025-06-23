import { describe, expect, it } from 'vitest';
import { toLocalPromptText, toNAIPromptText } from '../../src/lib/clipboard-utils';

describe('toNAIPromptText', () => {
    it('Transforma prompts estilo \'local\' al formato \'::\' con precisión', () => {
        // Arrange
        const text = '(beautiful:1.5), (lighting:2), normal background';
        const expected = '1.5::beautiful::, 2::lighting::, normal background';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Los paréntesis con formato incorrecto se mantienen igual', () => {
        // Arrange
        const text = '(cat::2), (:3), ((flower))';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe('(cat::2), (:3), ((flower))');
    });

    it('Si solo hay espacios, se devuelve igual', () => {
        // Arrange
        const text = '   ';
        const expected = '   ';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Los paréntesis anidados no se convierten', () => {
        // Arrange
        const text = '((cat:2)) and (((flower:1.5)))';
        const expected = '((cat:2)) and (((flower:1.5)))';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si hay formatos incorrectos mezclados, solo se convierten los que son posibles', () => {
        // Arrange
        const text = '(cat:2), (invalid::syntax), (dog:1.5)';
        const expected = '2::cat::, (invalid::syntax), 1.5::dog::';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('También se convierte con precisión cuando la parte numérica es un entero', () => {
        // Arrange
        const text = '(apple:3)';
        const expected = '3::apple::';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });
});

describe('toLocalPromptText', () => {
    it('Convierte la sintaxis \'::\' al formato (texto:número)', () => {
        // Arrange
        const text = '3::flower::, 1.5::lighting::, 2::sharpness::';
        const expected = '(flower:3), (lighting:1.5), (sharpness:2)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('El énfasis con llaves se convierte en aumento de peso', () => {
        // Arrange
        const text = '{{cat}} and {{{dog}}}';
        const expected = '(cat:1.1) and (dog:1.16)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('La disminución con corchetes se convierte en disminución de peso', () => {
        // Arrange
        const text = '[cat], [[dog]], [[[flower]]]';
        const expected = '(cat:0.95), (dog:0.91), (flower:0.86)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Convierte todos los estilos de énfasis mezclados', () => {
        // Arrange
        const text = '2::girl::, {{sky}}, [[shadow]], [low contrast], 4::sun::';
        const expected = '(girl:2), (sky:1.1), (shadow:0.91), (low contrast:0.95), (sun:4)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Los errores de sintaxis se conservan', () => {
        // Arrange
        const text = '{unclosed, [another one';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe('{unclosed, [another one');
    });

    it('Si solo hay espacios, se devuelve igual', () => {
        // Arrange
        const text = '    ';
        const expected = '    ';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Los estilos de énfasis sin número se ignoran', () => {
        // Arrange
        const text = '::no number::';
        const expected = '::no number::';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Se ignora la anidación extraña de paréntesis y solo se procesa lo que es posible', () => {
        // Arrange
        const text = '{{{{cat}}}}, [[[[dog]]]], ((((flower))))';
        const expected = '(cat:1.22), (dog:0.82), flower';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Las frases que contienen espacios y caracteres especiales también se procesan correctamente', () => {
        // Arrange
        const text = '2::cat with-hat::, [[weird~name!]]';
        const expected = '(cat with-hat:2), (weird~name!:0.91)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si el peso es exactamente 1, se devuelve sin paréntesis', () => {
        // Arrange
        const text = '1::flower::, {{cat}}, [[dog]]';
        const expected = 'flower, (cat:1.1), (dog:0.91)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si el peso es negativo, se devuelve sin paréntesis', () => {
        // Arrange
        const text = '-2::evil::, -0.5::darkness::';
        const expected = 'evil, darkness';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si el peso es mayor o menor que 1, se convierte igual', () => {
        // Arrange
        const text = '2::sky::, 0.5::shadow::';
        const expected = '(sky:2), (shadow:0.5)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si existen ( ), se devuelven los paréntesis escapados', () => {
        // Arrange
        const text = 'cat with (nested) parentheses';
        const expected = 'cat with \\(nested\\) parentheses';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si ( ) existen dentro de la sintaxis de peso, se devuelven los paréntesis escapados', () => {
        // Arrange
        const text = '2::cat with (nested)::';
        const expected = '(cat with \\(nested\\):2)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('Si ya es estilo Local, se devuelve igual', () => {
        const text = '(cat:2), (dog:1.5), (flower:3)';
        const expected = '(cat:2), (dog:1.5), (flower:3)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });
});