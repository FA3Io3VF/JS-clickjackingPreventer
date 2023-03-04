"""
A Pure Javascript Clickjacking Preventer - Copyright (C) 2023 Fabio F.G. Buono
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License 
as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/
"""


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
          
