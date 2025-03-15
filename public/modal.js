document.addEventListener("DOMContentLoaded", () => {
    const openButtons = document.querySelectorAll("[data-modal-target]");
    const closeButtons = document.querySelectorAll("[data-modal-close]");

    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.querySelector(button.getAttribute("data-modal-target"));
            if (modal) {
                modal.classList.add("modal__overlay--active");
                const modalContent = modal.querySelector(".modal__content");
                if (modalContent) modalContent.classList.add("modal__content--active");
            }
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal__overlay");
            if (modal) {
                modal.classList.remove("modal__overlay--active");
                const modalContent = modal.querySelector(".modal__content");
                if (modalContent) modalContent.classList.remove("modal__content--active");
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal__overlay")) {
            const modal = event.target;
            modal.classList.remove("modal__overlay--active");
            const modalContent = modal.querySelector(".modal__content");
            if (modalContent) modalContent.classList.remove("modal__content--active");
        }
    });
});