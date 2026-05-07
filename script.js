function resumeData() {
  return {
    selectedTemplate: 0,
    showBackModal: false,
    fullName: '',
    jobTitle: '',
    skills: '',
    education: '',
    showSkills: true,
    showEducation: true,
    contactEmail: 'info@digitalleague.ru',
    contactSite: 'www.digitalleague.ru',
    contactPhone: '+7 495 790 90 73',
    showContactEmail: true,
    showContactSite: true,
    showContactPhone: true,
    showContactsBlock: true,
    bgColor: '#FEECFF',
    showMain: true,
    showSkillsEdu: true,
    showContactsSection: true,
    showProjects: true,
    photoSrc: null,
    showPhoto: true,
    logoSrc: null,
    logoBottomSrc: null,
    showLogo: true,
    showLogoSection: false,
    showLanguages: false,
    languages: [],
    languageLevels: ['Новичок','Средний','Хороший','Очень хороший','Свободно владею','A1','A2','B1','B2','C1','C2'],
    addLanguage() { this.languages.push({ name: '', level: '', editing: true }) },
    removeLanguage(i) { this.languages.splice(i, 1) },
    confirmLanguage(i) { this.languages[i].editing = false },
    showLogoBottom: true,
    photoError: '',
    projects: [
      { company: '', organization: '', periodStart: '', periodEnd: '', isCurrent: false, role: '', description: '' }
    ],

    resetContacts() {
      this.contactEmail = 'info@digitalleague.ru'
      this.contactSite = 'www.digitalleague.ru'
      this.contactPhone = '+7 495 790 90 73'
    },
    addProject() {
      this.projects.push({ company: '', organization: '', periodStart: '', periodEnd: '', isCurrent: false, role: '', description: '' })
    },
    removeProject(i) {
      this.projects.splice(i, 1)
    },
    init(){
      const saved = localStorage.getItem('t1data');
      if(saved){
        try {
          const d = JSON.parse(saved);
          const keys = ['fullName','jobTitle','skills','education','bgColor','contactEmail','contactSite','contactPhone','showSkills','showEducation','showContactEmail','showContactSite','showContactPhone','showContactsBlock','showPhoto','showLogo','showLogoBottom','languages','projects'];
          keys.forEach(k => { if(d[k] !== undefined) this[k] = d[k]; });
        } catch(e){}
      }
      this.$watch('$data', () => {
        const keys = ['fullName','jobTitle','skills','education','bgColor','contactEmail','contactSite','contactPhone','showSkills','showEducation','showContactEmail','showContactSite','showContactPhone','showContactsBlock','showPhoto','showLogo','showLogoBottom','languages','projects'];
        const toSave = {};
        keys.forEach(k => toSave[k] = this[k]);
        localStorage.setItem('t1data', JSON.stringify(toSave));
      }, {deep: true});
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      return dateStr
    },
    initScaler() {
      const update = () => {
        const panel = document.querySelector('.preview-panel')
        if (!panel) return
        const available = panel.clientWidth - 64
        const scale = Math.min(1, available / 912)
        const marginBottom = (912 * scale) - 912
        document.querySelectorAll('.preview-scaler').forEach(scaler => {
          scaler.style.transform = `scale(${scale})`
          scaler.style.transformOrigin = 'top center'
          scaler.style.marginBottom = `${marginBottom}px`
        })
      }
      update()
      window._scalerUpdate = update
      window.removeEventListener('resize', window._scalerUpdate)
      window.addEventListener('resize', window._scalerUpdate)
    },
    async exportPDF() {
      const { jsPDF } = window.jspdf
      const element = document.querySelector('.page')
      const scaler = document.querySelector('.preview-scaler')

      if (scaler) {
        scaler.style.transform = 'scale(1)'
        scaler.style.marginBottom = '0'
      }

      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 912,
      })

      if (scaler) {
        const panel = scaler.parentElement
        const available = panel.clientWidth - 64
        const scale = Math.min(1, available / 912)
        scaler.style.transform = `scale(${scale})`
        scaler.style.marginBottom = `${(912 * scale - 912)}px`
      }

      const imgW = canvas.width / 2
      const imgH = canvas.height / 2

      const pdf = new jsPDF({
        orientation: imgW > imgH ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgW, imgH],
      })

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, imgW, imgH)
      pdf.save('resume.pdf')
    },
  }
}
