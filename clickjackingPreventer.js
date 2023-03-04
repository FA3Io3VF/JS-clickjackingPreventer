        class ClickjackingPreventer {
            static instance;
          
            static getInstance() {
              if (!ClickjackingPreventer.instance) {
                ClickjackingPreventer.instance = new ClickjackingPreventer();
              }
              return ClickjackingPreventer.instance;
            }
          
            constructor() {
              this.enabled = true;
              this.trustedDomains = ['https://www.example.com'];
              this.timeout = 5000;
              this.fallbackURL = 'https://www.example.com';
            }
          
            prevent() {
              if (!this.enabled) {
                return;
              }
              const currentUrl = window.location.href;
              if (window.top !== window.self) {
                this.enabled = false;
                return;
              }
          
              if (!document.referrer || !this.trustedDomains.includes(document.referrer)) {
                this.enabled = false;
                return;
              }
          
              try {
                setTimeout(() => {
                  this.enabled = false;
                  window.top.location = this.fallbackURL;
                }, this.timeout);
          
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
          
                iframe.contentWindow.location = currentUrl;
                window.top.location = currentUrl;
              } catch (error) {
                console.error(error);
                this.enabled = false;
                window.top.location = this.fallbackURL;
              }
            }
          }
          
          const clickjackingPreventer = ClickjackingPreventer.getInstance();
          clickjackingPreventer.prevent();
          
