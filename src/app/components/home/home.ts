import { AmenitiesService } from './../../service/amenities-service';
import { userService } from './../../service/user-service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ListingService } from '../../service/listing';
import { BookingService } from '../../service/bookings';
import { CategoryService } from '../../service/category-service';

Chart.register(...registerables, DataLabelsPlugin);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {

  users: any[] = [];

  // Counters
  usersCount = 0;
  listingsCount = 0;
  bookingsCount = 0;
  adsCount = 0;
  occupancyRate = 0;
  hostCount = 0;
  guestCount = 0;
  maleCount = 0;
  femaleCount = 0;
  approvedAds = 0;
  unapprovedAds = 0;
  paymentStatus = { paid: 0, pending: 0, failed: 0 };

  // Amenities
  amenitiesCount = 0;
  activeAmenities = 0;
  inactiveAmenities = 0;

  // Charts data
  amenitiesPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Active', 'Inactive'],
    datasets: [{ data: [0, 0], backgroundColor: ['#28B463', '#E74C3C'], borderColor: '#fff', borderWidth: 2 }]
  };

  listingsTitlePieData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  paymentStatusPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Paid', 'Pending', 'Failed'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#A2D9CE', '#F9E79F', '#F5B7B1'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  userTypePieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['host', 'guest'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#AED6F1', '#F9E79F'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  userGenderPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Male', 'Female', 'Unspecified'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#D2B4DE', '#FADBD8', '#BBBBBB'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  adsApprovalPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Approved', 'Unapproved'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#A3E4D7', '#8d86b6ff'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  // Payment status per day
  paymentStatusPerDayData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Paid', data: [], borderColor: 'green', backgroundColor: 'rgba(0, 128, 0, 0.3)', fill: false, tension: 0.3 },
      { label: 'Pending', data: [], borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.3)', fill: false, tension: 0.3 },
      { label: 'Failed', data: [], borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.3)', fill: false, tension: 0.3 }
    ]
  };

  // Bookings per day chart
  public bookingsPerDayLineData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Bookings', data: [], borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.3)', fill: false, tension: 0.3 }
    ]
  };

  // Chart options
  public miniPieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#000',
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return `${percentage.toFixed(0)}%`;
        }
      }
    }
  };

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  public pieChartPlugins = [DataLabelsPlugin];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: userService,
    private AmenitiesService:AmenitiesService,
    private listingsService : ListingService,
    private bookingsService: BookingService,
    private cateoryService : CategoryService
  ) {}
  ngOnInit(): void {
    this.loadCounts();
    this.listingsService.getNotApprovedListings().subscribe(data => {
      console.log((data.data));
      this.unapprovedAds = data.data.filter((ad: { isApproved: any; }) => !ad.isApproved).length;
      this.cdr.detectChanges();
    });
    this.cateoryService.getAllCategories().subscribe(data =>{
      console.log(data);
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateAllCharts(), 0);
  }

  loadCounts() {
    let usersLoaded = false;
    let unitsLoaded = false;
    let bookingsLoaded = false;
    let listingsLoaded = false;

    // Users
    this.userService.getUsers().subscribe(data => {
      console.log(data.data);
      this.users = data.data;
      this.usersCount = data.data.length;
      this.hostCount = data.data.filter((u: any) => u.role === 'host').length;
      this.guestCount = data.data.filter((u:any) => u.role === 'guest').length;
      this.maleCount = data.data.filter((u:any) => u.gender === 'male').length;
      this.femaleCount = data.data.filter((u:any) => u.gender === 'female').length;
      const unspecifiedCount = data.data.filter((u:any) => !u.gender || (u.gender !== 'male' && u.gender !== 'female')).length;

      this.userTypePieData.datasets[0].data = [this.hostCount, this.guestCount];
      this.userGenderPieData.datasets[0].data = [this.maleCount, this.femaleCount, unspecifiedCount];

      usersLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    // Amenities
    this.AmenitiesService.getAmenities().subscribe(data => {
      console.log((data.data));
      this.amenitiesCount = data.data.length;
      this.activeAmenities = data.data.filter((a: { isActive: any; }) => a.isActive).length;
      this.inactiveAmenities = data.data.filter((a: { isActive: any; }) => !a.isActive).length;
      this.amenitiesPieData.datasets[0].data = [this.activeAmenities, this.inactiveAmenities];

      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    // Listings
    this.listingsService.getListings().subscribe(data => {
      console.log((data.data));
      this.listingsCount = data.data.length;
      unitsLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    // Bookings + Payment Status + Bookings per day
    this.bookingsService.getBookings().subscribe(data => {
      console.log(data.bookings);
      this.bookingsCount = data.bookings.length;

      // Payment status counts
      this.paymentStatus.paid = data.bookings.filter((b: { paymentStatus: string; }) => b.paymentStatus === 'paid').length;
      this.paymentStatus.pending = data.bookings.filter((b: { paymentStatus: string; }) => b.paymentStatus === 'pending').length;
      this.paymentStatus.failed = data.bookings.filter((b: { paymentStatus: string; }) => b.paymentStatus === 'failed').length;
      this.paymentStatusPieData.datasets[0].data = [
        this.paymentStatus.paid,
        this.paymentStatus.pending,
        this.paymentStatus.failed
      ];

      // Group by date for both paymentStatusPerDayData and bookingsPerDayLineData
      const dateMap: { [date: string]: { paid: number; pending: number; failed: number; total: number } } = {};
      data.bookings.forEach((b: { date: any; createdAt: any; paymentStatus: string; }) => {
        const date = new Date(b.date || b.createdAt).toISOString().split('T')[0];
        if (!dateMap[date]) dateMap[date] = { paid: 0, pending: 0, failed: 0, total: 0 };
        if (b.paymentStatus === 'paid') dateMap[date].paid++;
        else if (b.paymentStatus === 'pending') dateMap[date].pending++;
        else if (b.paymentStatus === 'failed') dateMap[date].failed++;
        dateMap[date].total++;
      });

      const sortedDates = Object.keys(dateMap).sort();
      this.paymentStatusPerDayData.labels = sortedDates;
      this.paymentStatusPerDayData.datasets[0].data = sortedDates.map(d => dateMap[d].paid);
      this.paymentStatusPerDayData.datasets[1].data = sortedDates.map(d => dateMap[d].pending);
      this.paymentStatusPerDayData.datasets[2].data = sortedDates.map(d => dateMap[d].failed);

      // Bookings per day
      this.bookingsPerDayLineData.labels = sortedDates;
      this.bookingsPerDayLineData.datasets[0].data = sortedDates.map(d => dateMap[d].total);

      bookingsLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    // Ads
    this.listingsService.getListings().subscribe(data => {
      data = data.data.map((ad: { isApproved: string | boolean; }) => ({
        ...ad,
        isApproved: ad.isApproved === true || ad.isApproved === 'true'
      }));
      console.log((data));
      this.adsCount = data.length;
      this.approvedAds = data.filter((ad: { isApproved: any; }) => ad.isApproved).length;
      this.adsApprovalPieData.datasets[0].data = [this.approvedAds, this.unapprovedAds];

      const titleCounts: { [title: string]: number } = {};
      data.forEach((ad: { locationType: string; }) => {
        const title = ad.locationType || 'Unknown';
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });

      this.listingsTitlePieData.labels = Object.keys(titleCounts);
      this.listingsTitlePieData.datasets[0].data = Object.values(titleCounts);
      this.listingsTitlePieData.datasets[0].backgroundColor = Object.keys(titleCounts).map(() => this.getRandomColor());

      listingsLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();

    });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  tryUpdateCharts(usersLoaded: boolean, unitsLoaded: boolean, bookingsLoaded: boolean, listingsLoaded: boolean) {
    if (usersLoaded && unitsLoaded && bookingsLoaded && listingsLoaded) {
      this.updateCharts();
      this.updateAllCharts();
    }
  }

  updateCharts() {
    const values = [this.usersCount, this.bookingsCount, this.adsCount];
    this.barChartData.datasets[0].data = values;
    this.pieChartData.datasets[0].data = values;

    this.occupancyRate = this.listingsCount > 0
      ? Math.round((this.bookingsCount / this.listingsCount) * 100)
      : 0;
  }

  updateAllCharts() {
    this.charts?.forEach(chart => chart.update());
  }

  // Charts data & options
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Users',  'Bookings', 'Listings'],
    datasets: [{
      data: [0, 0, 0],
      label: 'Number',
      backgroundColor: ['#5DADE2',  '#F5B041', '#EC7063'],
      borderRadius: 8
    }]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Overall Statistics' }
    }
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Payment Status Over Time' },
      datalabels: {
        display: false
      }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Count' }, beginAtZero: true }
    }
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Users', 'Bookings', 'Listings'],
    datasets: [{
      label: 'Percentages',
      data: [0, 0, 0],
      backgroundColor: ['#AED6F1', '#FAD7A0', '#F5B7B1'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Distribution of Percentages' },
      datalabels: {
        color: '#000',
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return `${percentage.toFixed(1)}%`;
        }
      }
    }
  };
}
