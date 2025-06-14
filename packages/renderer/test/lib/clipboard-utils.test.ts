import { describe, expect, it } from 'vitest';
import { toLocalPromptText, toNAIPromptText } from '../../src/lib/clipboard-utils';

describe('toNAIPromptText', () => {
    it('local 스타일 프롬프트를 :: 형태로 정확히 변환한다', () => {
        // Arrange
        const text = '(beautiful:1.5), (lighting:2), normal background';
        const expected = '1.5::beautiful::, 2::lighting::, normal background';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('형식이 잘못된 괄호는 그대로 유지된다', () => {
        // Arrange
        const text = '(cat::2), (:3), ((flower))';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe('(cat::2), (:3), ((flower))');
    });

    it('공백만 있는 경우 그대로 반환한다', () => {
        // Arrange
        const text = '   ';
        const expected = '   ';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('중첩된 괄호는 변환하지 않는다', () => {
        // Arrange
        const text = '((cat:2)) and (((flower:1.5)))';
        const expected = '((cat:2)) and (((flower:1.5)))';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('잘못된 형식이 섞여있을 경우 변환 가능한 것만 변환한다', () => {
        // Arrange
        const text = '(cat:2), (invalid::syntax), (dog:1.5)';
        const expected = '2::cat::, (invalid::syntax), 1.5::dog::';

        // Act
        const result = toNAIPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('숫자 부분이 정수일 때도 정확히 변환한다', () => {
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
    it(':: 문법을 (text:number) 형식으로 변환한다', () => {
        // Arrange
        const text = '3::flower::, 1.5::lighting::, 2::sharpness::';
        const expected = '(flower:3), (lighting:1.5), (sharpness:2)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('중괄호 강조는 가중치 증가로 변환된다', () => {
        // Arrange
        const text = '{{cat}} and {{{dog}}}';
        const expected = '(cat:1.1) and (dog:1.16)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('대괄호 감소는 가중치 감소로 변환된다', () => {
        // Arrange
        const text = '[cat], [[dog]], [[[flower]]]';
        const expected = '(cat:0.95), (dog:0.91), (flower:0.86)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('혼합된 강조 스타일을 모두 변환한다', () => {
        // Arrange
        const text = '2::girl::, {{sky}}, [[shadow]], [low contrast], 4::sun::';
        const expected = '(girl:2), (sky:1.1), (shadow:0.91), (low contrast:0.95), (sun:4)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('문법 오류는 그대로 보존된다', () => {
        // Arrange
        const text = '{unclosed, [another one';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe('{unclosed, [another one');
    });

    it('공백만 있는 경우 그대로 반환한다', () => {
        // Arrange
        const text = '    ';
        const expected = '    ';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('숫자가 없는 강조 스타일은 무시된다', () => {
        // Arrange
        const text = '::no number::';
        const expected = '::no number::';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('이상한 괄호 중첩은 무시하고 처리 가능한 것만 처리한다', () => {
        // Arrange
        const text = '{{{{cat}}}}, [[[[dog]]]], ((((flower))))';
        const expected = '(cat:1.22), (dog:0.82), flower';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('공백과 특수문자가 포함된 문구도 정확히 처리된다', () => {
        // Arrange
        const text = '2::cat with-hat::, [[weird~name!]]';
        const expected = '(cat with-hat:2), (weird~name!:0.91)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('가중치가 정확히 1인 경우는 괄호 없이 반환된다', () => {
        // Arrange
        const text = '1::flower::, {{cat}}, [[dog]]';
        const expected = 'flower, (cat:1.1), (dog:0.91)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('가중치가 음수인 경우 괄호 없이 반환된다', () => {
        // Arrange
        const text = '-2::evil::, -0.5::darkness::';
        const expected = 'evil, darkness';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('가중치가 1보다 크거나 작은 경우는 그대로 변환된다', () => {
        // Arrange
        const text = '2::sky::, 0.5::shadow::';
        const expected = '(sky:2), (shadow:0.5)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('( ) 가 존재하는 경우 이스케이프 처리된 괄호를 반환한다', () => {
        // Arrange
        const text = 'cat with (nested) parentheses';
        const expected = 'cat with \\(nested\\) parentheses';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });

    it('( )가 가중치 문법 내부에 존재하는 경우 이스케이프 처리된 괄호를 반환한다', () => {
        // Arrange
        const text = '2::cat with (nested)::';
        const expected = '(cat with \\(nested\\):2)';

        // Act
        const result = toLocalPromptText(text);

        // Assert
        expect(result).toBe(expected);
    });
});
