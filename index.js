/* ==========================================================================
   SnoopGarden Pet Shop - Custom Script
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. SCROLL EFFECT NO HEADER */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Executa no carregamento inicial caso a pagina ja esteja rolada

    /* 2. MENU MOBILE TOGGLE */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpened = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isOpened);
        mobileNavToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    mobileNavToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer link da navegacao
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* 3. SCROLL SPY - DESTAQUE DE LINK ATIVO NA NAVEGAÇÃO */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 160; // Offset do header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    /* 4. SELEÇÃO DIRETA DE SERVIÇO (CONEXÃO ENTRE CARD & FORMULÁRIO) */
    const selectServiceButtons = document.querySelectorAll('.btn-select-service');
    const bookingServiceSelect = document.getElementById('booking-service');

    selectServiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const serviceName = button.getAttribute('data-service');
            
            if (serviceName && bookingServiceSelect) {
                // Altera o valor no select do formulario
                bookingServiceSelect.value = serviceName;
                
                // Dispara efeito visual suave de destaque no select do formulario
                bookingServiceSelect.classList.add('highlight-flash');
                setTimeout(() => {
                    bookingServiceSelect.classList.remove('highlight-flash');
                }, 1000);
            }
        });
    });

    // Rolagem para card especifico se clicar nos links de icones da barra rapida
    const quickServiceItems = document.querySelectorAll('.quick-service-item');
    quickServiceItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-service-target');
            const targetCard = document.getElementById(`card-${targetId}`);
            
            if (targetCard) {
                // Rola para a secao servicos
                const servicesSection = document.getElementById('servicos');
                window.scrollTo({
                    top: servicesSection.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Efeito visual piscante no card especifico
                targetCard.style.transform = 'translateY(-15px) scale(1.02)';
                targetCard.style.boxShadow = '0 15px 30px rgba(0, 82, 72, 0.2)';
                targetCard.style.borderColor = 'var(--color-accent)';

                setTimeout(() => {
                    targetCard.style.transform = '';
                    targetCard.style.boxShadow = '';
                    targetCard.style.borderColor = '';
                }, 2000);
            }
        });
    });

    /* 5. INICIALIZAÇÃO DO MAPA INTERATIVO REALISTA (LEAFLET.JS) */
    // Endereco da imagem: Rua Numa Pompilio Bittencourt, Nº131, Pernambues, Salvador-BA
    // Coordenadas geograficas aproximadas deste local em Salvador.
    const snoopGardenCoords = [-12.96614602349712, -38.46877426332561]; 

    try {
        const map = L.map('leaflet-map', {
            center: snoopGardenCoords,
            zoom: 16,
            scrollWheelZoom: false // Impede que o scroll do usuario de zoom sem querer
        });

        // Adiciona tiles bonitos e leves (CartoDB Positron - visual limpo e estetico)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Estiliza o popup informativo
        const popupContent = `
            <div style="font-family: 'Inter', sans-serif; padding: 4px;">
                <h4 style="margin: 0 0 6px 0; color: #008272; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;">Pet Shop Snoopy Garden</h4>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #555;">📍 R. Numa Pompílio Bitencourt, 131 - Pernambués, Jardim Brasília</p>
                <p style="margin: 0; font-size: 12px; color: #f43f5e; font-weight: bold;">📞 (71) 99992-2320</p>
            </div>
        `;

        // Marcador vermelho/pink personalizado
        const customIcon = L.divIcon({
            html: `<div style="background-color: #f43f5e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(244,63,94,0.6); position: relative; animation: pulse 2s infinite;"></div>`,
            className: 'custom-map-pin',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        L.marker(snoopGardenCoords, { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent)
            .openPopup();

    } catch (error) {
        console.error("Erro ao inicializar o mapa Leaflet: ", error);
        // Exibe um fallback de mapa se falhar por falta de conexao
        const mapContainer = document.getElementById('leaflet-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; text-align:center; background-color:#eaeaea; color:#555;">
                    <p style="font-weight:bold; margin-bottom:8px;">🗺️ Pet Shop Snoopy Garden está aqui!</p>
                    <p style="font-size:13px;">R. Numa Pompílio Bitencourt, 131 - Pernambués, Jardim Brasília, Salvador - BA, 41100-170</p>
                </div>
            `;
        }
    }

    /* 6. FORMULÁRIO DE AGENDAMENTO INTEGRAÇÃO WHATSAPP */
    const bookingForm = document.getElementById('whatsapp-booking-form');
    
    // Limita a selecao de data no formulario apenas para o dia atual ou datas futuras
    const bookingDateInput = document.getElementById('booking-date');
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
    }

    // Função de validação rápida para cada campo do formulário
    const validateField = (inputEl, errorEl) => {
        let isValid = true;
        
        if (!inputEl.value.trim()) {
            isValid = false;
        } else if (inputEl.id === 'booking-date') {
            const selectedDate = new Date(inputEl.value + 'T00:00:00');
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            if (selectedDate < todayDate) isValid = false;
        }

        const formGroup = inputEl.closest('.form-group');
        if (!isValid) {
            formGroup.classList.add('has-error');
        } else {
            formGroup.classList.remove('has-error');
        }

        return isValid;
    };

    // Remove classes de erro assim que o usuário digita/muda o campo
    const formFields = bookingForm.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            const formGroup = field.closest('.form-group');
            formGroup.classList.remove('has-error');
        });
        field.addEventListener('change', () => {
            const formGroup = field.closest('.form-group');
            formGroup.classList.remove('has-error');
        });
    });

    // Envio do formulário
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Elementos dos campos
        const tutorNameInput = document.getElementById('tutor-name');
        const petNameInput = document.getElementById('pet-name');
        const petTypeSelect = document.getElementById('pet-type');
        const serviceSelect = document.getElementById('booking-service');
        const dateInput = document.getElementById('booking-date');
        const notesTextarea = document.getElementById('booking-notes');

        // Validar todos os campos
        let isFormValid = true;
        isFormValid &= validateField(tutorNameInput, document.getElementById('err-tutor-name'));
        isFormValid &= validateField(petNameInput, document.getElementById('err-pet-name'));
        isFormValid &= validateField(petTypeSelect, document.getElementById('err-pet-type'));
        isFormValid &= validateField(serviceSelect, document.getElementById('err-booking-service'));
        isFormValid &= validateField(dateInput, document.getElementById('err-booking-date'));

        if (!isFormValid) {
            // Rola suavemente para o primeiro erro do formulário
            const firstError = bookingForm.querySelector('.form-group.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Formatação da data (pt-BR)
        const dateParts = dateInput.value.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        // Coleta e formatação das observações
        const notes = notesTextarea.value.trim() ? notesTextarea.value.trim() : 'Nenhuma';

        // CONSTRUÇÃO DA MENSAGEM WHATSAPP
        const messageText = 
`🐾 *Pet Shop Snoopy Garden* 🐾
Olha! Gostaria de agendar um horário para o meu pet:

👤 *Tutor:* ${tutorNameInput.value.trim()}
🐶 *Pet:* ${petNameInput.value.trim()} (${petTypeSelect.value})
🩺 *Serviço:* ${serviceSelect.value}
📅 *Data:* ${formattedDate}

📝 *Notas/Preferências:* ${notes}

_Feito pelo Agendamento Online Pet Shop Snoopy Garden._`;

        // URL encode do texto
        const encodedMessage = encodeURIComponent(messageText);
        
        // Número comercial do SnoopGarden (exatamente como no post)
        // 55 (Brasil) + 71 (DDD Salvador) + 999922320
        const whatsappNumber = '5571999922320';
        
        // Link final
        const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

        // Abre em uma nova aba e envia o agendamento
        window.open(whatsappLink, '_blank');

        // Limpa opcionalmente o formulário de forma amigável
        bookingForm.reset();
        
        // Feedback visual de sucesso na tela
        alert("Agendamento preparado com sucesso! Você será redirecionado para o WhatsApp para confirmar seu horário. Obrigado!");
    });
});
