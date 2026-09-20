const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('open');
    document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('visible'));
}

const form = document.querySelector('#contact-form');
const status = form.querySelector('.form-status');
const phoneInput = form.querySelector('#telefone');

phoneInput.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;

    if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    phoneInput.value = formatted;
});

form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
        field.closest('.field').classList.remove('invalid');
        field.removeAttribute('aria-invalid');
        status.textContent = '';
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;

    form.querySelectorAll('[required]').forEach((field) => {
        const phoneIsValid = field.id !== 'telefone' || field.value.replace(/\D/g, '').length >= 10;
        const isValid = field.checkValidity() && field.value.trim() !== '' && phoneIsValid;
        const wrapper = field.closest('.field');
        wrapper.classList.toggle('invalid', !isValid);
        field.setAttribute('aria-invalid', String(!isValid));
        if (!isValid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
        status.textContent = 'Revise os campos destacados para continuar.';
        firstInvalid.focus();
        return;
    }

    const message = [
        'Olá! Entrei em contato pelo site da Neves Marketing.',
        '',
        `Nome: ${form.nome.value.trim()}`,
        `E-mail: ${form.email.value.trim()}`,
        `Telefone: ${form.telefone.value.trim()}`,
        `Mensagem: ${form.mensagem.value.trim()}`
    ].join('\n');

    window.open(`https://wa.me/5531997641538?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    status.textContent = 'Abrimos o WhatsApp com sua mensagem pronta para envio.';
    form.reset();
});
