document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll('.role-card');
    const nextButton = document.querySelector('.next-button');
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/update-role';

    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            // Update radio button
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;

            // Update visual selection
            roleCards.forEach(c => c.style.borderColor = '#e8dbce');
            card.style.borderColor = '#f2800d';
        });
    });

    nextButton.addEventListener('click', () => {
        const selectedRole = document.querySelector('input[name="user-type"]:checked');
        if (selectedRole) {
            form.innerHTML = `<input type="hidden" name="role" value="${selectedRole.value}">`;
            document.body.appendChild(form);
            form.submit();
        }
    });
});