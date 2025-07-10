const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      products: "Products",
      contact: "Contact",
    },
    hero: {
      title: "Finest <highlight>Premium</highlight> Olive Oil",
      description:
        "Harvested from the ancient groves of Tunisia's historic Maktaris region,<br/> our olive oil blends centuries of tradition with modern excellence.",
      premiumFeatures: [
        {
          title: "Organic",
          description:
            "Certified organic, nurtured with care in fertile Tunisian lands",
        },
        {
          title: "Cold Pressed",
          description: "Extracted below 27°C to preserve purity and freshness",
        },
        {
          title: "Single Origin",
          description: "Sourced exclusively from the renowned Maktaris groves",
        },
        {
          title: "Limited Batch",
          description:
            "Produced in small seasonal runs to ensure exceptional quality",
        },
      ],
      scrollIndicator: "Discover Our Selection",
      est: "Est. 1895",
    },
    about: {
      title: "About <highlight>Agro Maktaris</highlight>",
      description:
        "Explore the authentic story behind our passion for exceptional Tunisian olive oil, rooted in the fertile lands of historic Maktaris.",
      ourStoryTitle: "<highlight>Our Story</highlight>",
      ourStoryText:
        " — the ancient Roman name for a historic city in northwestern Tunisia — flourished due to its fertile soil and rich agricultural heritage, especially in olive oil production.<br/>Inspired by this legacy, Agro Maktaris is dedicated to elevating Tunisian olive oil on the global stage by delivering excellence grounded in tradition, authenticity, and unmatched quality.",

      whyChooseUs: {
        title: "Why Choose Us",
        subtitle: "The excellence that sets us apart",
        features: [
          {
            icon: "Award",
            title: "Premium Quality",
            description:
              "Certified extra virgin olive oil crafted to the highest standards.",
          },
          {
            icon: "Leaf",
            title: "100% Natural",
            description:
              "Pure, authentic products free from artificial additives or preservatives.",
          },
          {
            icon: "Heart",
            title: "Tradition",
            description:
              "Time-honored methods passed down through generations.",
          },
          {
            icon: "Users",
            title: "Family Heritage",
            description:
              "A family business with decades of olive oil expertise.",
          },
        ],
      },
      values: {
        title: "Our Values",
        list: [
          "Authenticity and transparency",
          "Respect for the environment",
          "Support for local producers",
          "Innovation rooted in tradition",
          "Excellence in customer service",
          "Sustainable agricultural practices",
          "Preservation of cultural heritage",
        ],
      },
      mission: {
        title: "Our Mission",
        description:
          "To share the finest Tunisian olive oil with the world while preserving traditional methods and empowering local communities. We unite ancient wisdom with modern excellence.",
        points: [
          "Preserve traditional olive oil production techniques",
          "Support local farmers and communities",
          "Deliver exceptional quality products globally",
          "Promote Tunisia's rich agricultural heritage",
          "Maintain sustainable farming practices",
        ],
      },
      commitment: {
        title: "Our Commitment",
        subtitle: "Every bottle tells a story of dedication",
        description:
          "From the ancient olive groves of Maktaris to your kitchen, we ensure each drop of our olive oil meets the highest standards of quality and authenticity. Our commitment extends beyond production to preserving Tunisia's rich agricultural legacy.",
      },
      cta: {
        title: "Ready to discover our products?",
        subtitle: "Explore our selection of premium Tunisian olive oils",
        buttonText: "View Our Products",
        buttonLink: "#products",
      },
      floatingCta: {
        text: "Let's get in touch !",
        mailtoSubject: "Inquiry About Products",
      },
    },
    products: {
      title: "<highlight>Maktaris</highlight><br/>Premium Collection",
      description:
        "Dive into the vibrant essence of Maktaris with our exclusive olive oils, each bottle capturing the soul and heritage of our ancestral terroir.",
      craftedWithPassion: "Crafted with the Maktaris Spirit",
      passionDescription:
        "Each bottle reflects the living energy and age-old traditions of Maktaris, blending passion, authenticity, and expertise to deliver an unparalleled olive oil experience.",
      featureLabels: {
        coldPressed: "Cold Pressed",
        firstHarvest: "First Harvest",
        richInAntioxidants: "Rich in Antioxidants",
        organicCertified: "Organic Certified",
        limitedEdition: "Limited Edition",
      },
      items: [
        {
          name: "Maktaris Gold Reserve",
          variety: "Exclusive Blend",
          description:
            "An exceptional olive oil with an intense fruity aroma and golden hue—perfect for enhancing refined culinary creations.",
          features: [
            "coldPressed",
            "firstHarvest",
            "richInAntioxidants",
            "limitedEdition",
            "singleEstate",
            "organicCertified",
          ],
          icon: "Award",
          image: "firstbottle.png",
        },
        {
          name: "Maktaris Herb Infusion",
          variety: "Single Origin",
          description:
            "A delicate blend infused with fresh Mediterranean basil and rosemary, evoking the fragrant fields of Tunisia.",
          features: [
            "herbInfused",
            "singleEstate",
            "organicCertified",
            "coldPressed",
            "smoothFinish",
          ],
          icon: "Leaf",
          image: "secondbottle.png",
        },
        {
          name: "Maktaris Sunset Blend",
          variety: "Limited Edition",
          description:
            "Harvested at twilight to capture deep, mellow flavors, this silky oil finishes with a memorable peppery touch.",
          features: [
            "sunsetHarvest",
            "limitedEdition",
            "smoothFinish",
            "firstHarvest",
            "richInAntioxidants",
          ],
          icon: "Sun",
          image: "thirdbottle.png",
        },
        {
          name: "Maktaris Heritage Classic",
          variety: "Family Recipe",
          description:
            "Passed down through generations, this timeless olive oil honors the culinary legacy of Maktaris.",
          features: [
            "traditionalMethod",
            "familyRecipe",
            "timeTested",
            "organicCertified",
            "coldPressed",
          ],
          icon: "Heart",
          image: "fourthbottle.png",
        },
      ],
    },
    contact: {
      title: "Get in <highlight>Touch</highlight>",
      subtitle: "Want our finest olive oils? Get in touch!",
      form: {
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "Enter your email address",
        subject: "Subject",
        subjectPlaceholder: "What's this about?",
        message: "Your Message",
        messagePlaceholder: "Tell us about your inquiry...",
        send: "Let's Talk",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      },
      contactInfoTitle: "Contact <highlight>Information</highlight>",
      contactInfo: {
        visitFarm: "Visit Our Farm",
        visitFarmValue: "Olive Grove Estate<br/>Makthar, Tunisia<br/>5000",
        callUs: "Call Us",
        callUsValue: "+216 1234587",
        emailUs: "Email Us",
        emailUsValue: "agromaktaris@gmail.com",
        workingHours: "Working Hours",
        workingHoursValue:
          "Mon - Fri: 8:00 AM - 6:00 PM<br/>Sat: 9:00 AM - 4:00 PM<br/>Sun: Closed",
      },
      notification: {
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      },
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      products: "Produits",
      contact: "Contact",
    },
    hero: {
      title: "Huile d'Olive <highlight>Premium</highlight> ",
      description:
        "Récoltée dans les anciens vergers de la région historique de Maktaris en Tunisie,<br/> notre huile d'olive allie des siècles de tradition à l'excellence moderne.",
      premiumFeatures: [
        {
          title: "Biologique",
          description:
            "Certifiée bio, cultivée avec soin sur les terres fertiles tunisiennes",
        },
        {
          title: "Pressée à froid",
          description: "Extraite sous 27°C pour préserver pureté et fraîcheur",
        },
        {
          title: "Origine unique",
          description: "Issue exclusivement des vergers renommés de Maktaris",
        },
        {
          title: "Lot limité",
          description:
            "Produite en petites séries saisonnières pour une qualité exceptionnelle",
        },
      ],
      scrollIndicator: "Découvrez notre sélection",
      est: "Établi en 1895",
    },
    about: {
      title: "À propos de <highlight>Agro Maktaris</highlight>",
      description:
        "Découvrez l'histoire authentique de notre passion pour l'huile d'olive tunisienne exceptionnelle, enracinée dans les terres fertiles de l'historique Maktaris.",
      ourStoryTitle: "<highlight>Notre Histoire</highlight>",
      ourStoryText:
        " — le nom romain ancien d'une ville historique du nord-ouest de la Tunisie — a prospéré grâce à son sol fertile et son riche héritage agricole, notamment dans la production d'huile d'olive.<br/>Inspiré par cet héritage, Agro Maktaris s'engage à valoriser l'huile d'olive tunisienne sur la scène mondiale en offrant l'excellence fondée sur la tradition, l'authenticité et une qualité inégalée.",
      whyChooseUs: {
        title: "Pourquoi Nous Choisir",
        subtitle: "L'excellence qui nous distingue",
        features: [
          {
            icon: "Award",
            title: "Qualité Premium",
            description:
              "Huile d'olive extra vierge certifiée, produite selon les plus hauts standards.",
          },
          {
            icon: "Leaf",
            title: "100% Naturel",
            description:
              "Produits purs et authentiques sans additifs ni conservateurs artificiels.",
          },
          {
            icon: "Heart",
            title: "Tradition",
            description:
              "Méthodes ancestrales transmises de génération en génération.",
          },
          {
            icon: "Users",
            title: "Héritage Familial",
            description:
              "Entreprise familiale avec des décennies d'expertise en huile d'olive.",
          },
        ],
      },
      values: {
        title: "Nos Valeurs",
        list: [
          "Authenticité et transparence",
          "Respect de l'environnement",
          "Soutien aux producteurs locaux",
          "Innovation enracinée dans la tradition",
          "Excellence du service client",
          "Pratiques agricoles durables",
          "Préservation du patrimoine culturel",
        ],
      },
      mission: {
        title: "Notre Mission",
        description:
          "Apporter la meilleure huile d'olive tunisienne au monde tout en préservant les méthodes traditionnelles et en soutenant les communautés locales. Nous faisons le pont entre la sagesse ancienne et l'excellence moderne.",
        points: [
          "Préserver les méthodes traditionnelles de production d'huile d'olive",
          "Soutenir les agriculteurs et communautés locales",
          "Livrer des produits d'excellence dans le monde entier",
          "Promouvoir le patrimoine agricole tunisien",
          "Maintenir des pratiques agricoles durables",
        ],
      },
      commitment: {
        title: "Notre Engagement",
        subtitle: "Chaque bouteille raconte une histoire de dévouement",
        description:
          "Des anciennes oliveraies de Maktaris à votre cuisine, nous garantissons que chaque goutte de notre huile d'olive respecte les plus hauts standards de qualité et d'authenticité. Notre engagement dépasse la production pour préserver le riche patrimoine agricole tunisien.",
      },
      cta: {
        title: "Prêt à découvrir nos produits ?",
        subtitle:
          "Explorez notre sélection d'huiles d'olive tunisiennes premium",
        buttonText: "Voir nos produits",
        buttonLink: "#products",
      },
      floatingCta: {
        text: "Contactez-nous !",
        mailtoSubject: "Demande de renseignements sur les produits",
      },
    },
    products: {
      title: "<highlight>Maktaris</highlight><br/>Collection Premium",
      description:
        "Plongez dans l'essence vibrante de Maktaris avec nos huiles d'olive exclusives, chaque bouteille capturant l'âme et le patrimoine de notre terroir ancestral.",
      craftedWithPassion: "Fabriqué avec l'Esprit Maktaris",
      passionDescription:
        "Chaque flacon reflète l'énergie vivante et les traditions séculaires de Maktaris, unissant passion, authenticité et savoir-faire pour une expérience d'huile d'olive incomparable.",
      featureLabels: {
        coldPressed: "Pressée à Froid",
        firstHarvest: "Première Récolte",
        richInAntioxidants: "Riche en Antioxydants",
        organicCertified: "Certifiée Bio",
        limitedEdition: "Édition Limitée",
      },
      items: [
        {
          name: "Réserve d’Or Maktaris",
          variety: "Mélange Exclusif",
          description:
            "Huile d’olive d’exception à l’arôme fruité intense et à la robe dorée, idéale pour magnifier les mets raffinés.",
          features: [
            "coldPressed",
            "firstHarvest",
            "richInAntioxidants",
            "limitedEdition",
            "singleEstate",
            "organicCertified",
          ],
          icon: "Award",
          image: "firstbottle.png",
        },
        {
          name: "Infusion d’Herbes Maktaris",
          variety: "Origine Unique",
          description:
            "Mariage subtil de basilic et de romarin méditerranéens, cette huile évoque la fraîcheur des champs tunisiens.",
          features: [
            "herbInfused",
            "singleEstate",
            "organicCertified",
            "coldPressed",
            "smoothFinish",
          ],
          icon: "Leaf",
          image: "secondbottle.png",
        },
        {
          name: "Mélange Coucher de Soleil Maktaris",
          variety: "Édition Limitée",
          description:
            "Récoltée à la lumière dorée du crépuscule, cette huile veloutée libère une touche finale poivrée inoubliable.",
          features: [
            "sunsetHarvest",
            "limitedEdition",
            "smoothFinish",
            "firstHarvest",
            "richInAntioxidants",
          ],
          icon: "Sun",
          image: "thirdbottle.png",
        },
        {
          name: "Classique Héritage Maktaris",
          variety: "Recette Familiale",
          description:
            "Transmise de génération en génération, cette huile intemporelle célèbre l’héritage culinaire de Maktaris.",
          features: [
            "traditionalMethod",
            "familyRecipe",
            "timeTested",
            "organicCertified",
            "coldPressed",
          ],
          icon: "Heart",
          image: "fourthbottle.png",
        },
      ],
    },
    contact: {
      title: "Prenez <highlight>Contact</highlight>",
      subtitle: "Envie de nos meilleures huiles d'olive ? Contactez-nous !",
      form: {
        name: "Nom complet",
        namePlaceholder: "Entrez votre nom complet",
        email: "Adresse e-mail",
        emailPlaceholder: "Entrez votre adresse e-mail",
        subject: "Sujet",
        subjectPlaceholder: "De quoi s'agit-il ?",
        message: "Votre message",
        messagePlaceholder: "Parlez-nous de votre demande...",
        send: "Parlons-en",
        sending: "Envoi...",
        success: "Message envoyé avec succès !",
        error: "Échec de l'envoi du message. Veuillez réessayer.",
      },
      contactInfoTitle: "Informations de <highlight>contact</highlight>",
      contactInfo: {
        visitFarm: "Visitez notre ferme",
        visitFarmValue: "Domaine Olive Grove<br/>Makthar, Tunisie<br/>5000",
        callUs: "Appelez-nous",
        callUsValue: "+216 1234587",
        emailUs: "Envoyez-nous un e-mail",
        emailUsValue: "agromaktaris@gmail.com",
        workingHours: "Heures d'ouverture",
        workingHoursValue:
          "Lun - Ven : 8h00 - 18h00<br/>Sam : 9h00 - 16h00<br/>Dim : Fermé",
      },
      notification: {
        title: "Message envoyé !",
        description: "Nous vous répondrons bientôt.",
      },
    },
    footer: {
      rights: "Tous droits réservés.",
    },
  },
};

export default translations;
