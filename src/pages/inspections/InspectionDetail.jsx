import { useParams, useNavigate } from "react-router-dom";
import { mockInspections, mockInspectionsExtended } from "../../data/mockInspections";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Printer } from "lucide-react";

// Print styles for A4 PDF - optimized for certificate and report printing
const printStyles = `
  @media print {
  @page { 
    size: A4; 
    margin: 5mm; 
  }
  * {
    -webkit-print-color-adjust: exact !important; 
    print-color-adjust: exact !important;
  }
  html, body { 
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }
  .print-hide {
      display: none !important;
    }
  .report-page {
    width: 100% !important;
    max-width: 100% !important;
    min-height: auto !important;
    padding: 4mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    background: white !important;
    page-break-inside: avoid;
    font-size: 9px !important;
  }
  .report-page h1 { 
    font-size: 12px !important;
    margin: 0 0 2mm 0 !important;
  }
  .report-page h2 { 
    font-size: 10px !important;
    margin: 0 0 2mm 0 !important;
  }
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 8px !important;
    margin: 2mm 0 !important;
  }
  th, td {
    padding: 2mm !important;
    border: 0.5px solid #ddd !important;
  }
  .page-break {
    page-break-before: always !important;
    }
  }
`;

function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const inspection =
    mockInspectionsExtended.find((i) => i.id === id) ||
    mockInspections.find((i) => i.id === id);

  const canViewPII = user?.role?.toLowerCase() !== "viewer";

  if (!inspection) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Inspection not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const inspectionDate = formatDateShort(inspection.inspectionDate || new Date().toISOString());
  const expiryDate = (() => {
    const d = new Date(inspection.inspectionDate || new Date());
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString("en-GB");
  })();

  // Determine vehicle category (HEAVY or LIGHT)
  const vehicleCategory = inspection.vehicle?.type?.toLowerCase().includes("heavy") || 
                         inspection.vehicle?.type?.toLowerCase().includes("bus") ||
                         inspection.vehicle?.type?.toLowerCase().includes("truck") 
                         ? "HEAVY" : "LIGHT";

  // Machine test results
  const machinePass = inspection.machineResults?.every(r => r.status === "Pass") ?? true;
  
  // Visual inspection results
  const visualPass = inspection.visualResults?.every(r => r.status === "Pass") ?? true;
  const visualPoints = inspection.visualResults?.filter(r => r.status === "Pass").length || 0;
  const totalVisualPoints = inspection.visualResults?.length || 30;
  
  const overallResult = machinePass && visualPass ? "PASS" : "FAIL";

  // Format chassis number
  const formatChassis = (c) => c?.length > 12 ? `${c.slice(0, 6)}...${c.slice(-4)}` : c;

  return (
    <>
      <style>{printStyles}</style>
      <div className="w-full space-y-6">
        {/* Header Actions */}
        <div className="print-hide flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Complete Inspection Report</h2>
            <p className="text-sm text-gray-500">Machine Test + Visual Inspection (2 Pages)</p>
          </div>
          <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
              Back
        </button>
        <button
          onClick={() => window.print()}
              className="px-6 py-2 rounded-lg bg-[#88bf47] text-white font-semibold hover:bg-[#007c2d] flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
              Print Report
        </button>
          </div>
        </div>

        {/* PAGE 1: Machine Test - Lideta Style */}
        <div className="report-page bg-white border border-gray-300 rounded-lg shadow-lg mx-auto mb-6 p-6" style={{ maxWidth: '210mm', fontSize: '11px' }}>
          {/* Header - Lideta Style */}
          <div className="border-b-2 border-gray-800 pb-3 mb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-center leading-tight">PSTS<br/>LOGO</span>
      </div>
              <div>
                  <h1 className="text-base font-bold text-gray-900 uppercase">Awash Valley Technical Inspection S.C.</h1>
                  <p className="text-[10px] text-gray-600">LIDETA INFRONT OF POLICE HOSPITAL - ADDIS ABABA</p>
                </div>
              </div>
              <div className="text-right text-[10px]">
                <p>Phone 1: <strong>+251-11-153639</strong></p>
                <p>Fax: <strong>000000000</strong></p>
            </div>
          </div>
        </div>

          {/* Client & Vehicle Data Table */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border border-gray-300">
              <div className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1">CLIENT DATA</div>
              <table className="w-full text-[10px]">
                <tbody>
                  <tr><td className="px-2 py-1 border-b">Name:</td><td className="px-2 py-1 border-b font-semibold">{canViewPII ? inspection.vehicle.owner.name : '***'}</td></tr>
                  <tr><td className="px-2 py-1 border-b">Address:</td><td className="px-2 py-1 border-b">Addis Ababa</td></tr>
                  <tr><td className="px-2 py-1 border-b">Province:</td><td className="px-2 py-1 border-b">-</td></tr>
                  <tr><td className="px-2 py-1">Phone:</td><td className="px-2 py-1">{canViewPII ? inspection.vehicle.owner.phone : '***'}</td></tr>
                </tbody>
              </table>
                  </div>
            <div className="border border-gray-300">
              <div className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1">VEHICLE INFORMATION</div>
              <table className="w-full text-[10px]">
                <tbody>
                  <tr>
                    <td className="px-2 py-1 border-b w-32">Licence plate number:</td>
                    <td className="px-2 py-1 border-b font-bold">{inspection.vehicle.plate}</td>
                    <td className="px-2 py-1 border-b w-12">Km.:</td>
                    <td className="px-2 py-1 border-b font-semibold">{inspection.vehicle.vin?.slice(-6) || '125480'}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 border-b">Brand / Model:</td>
                    <td colSpan="3" className="px-2 py-1 border-b font-semibold">{inspection.vehicle.make} {inspection.vehicle.model}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 border-b">Chassis:</td>
                    <td className="px-2 py-1 border-b font-mono text-[9px]">{formatChassis(inspection.vehicle.vin)}</td>
                    <td className="px-2 py-1 border-b">Motor Nº:</td>
                    <td className="px-2 py-1 border-b font-mono text-[9px]">{inspection.vehicle.vin?.slice(0, 10) || 'YC6L310-42'}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1">Test start:</td>
                    <td colSpan="3" className="px-2 py-1 font-semibold">{formatDate(inspection.inspectionDate || new Date().toISOString())}</td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>

          <div className="text-[10px] mb-2 flex gap-4">
            <span>Technician: <strong>{inspection.meta?.inspectorName || 'GETU'}</strong></span>
            <span>Lane Nº: <strong>1</strong></span>
            <span>Lane type: <strong>-</strong></span>
            <span>Inspection Nº: <strong>{inspection.id.slice(-2)}</strong></span>
      </div>

          {/* ALIGNMENT Section */}
          <table className="w-full border border-gray-400 text-[10px] mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left w-24"></th>
                <th className="border px-2 py-1">MEASUREMENT</th>
                <th className="border px-2 py-1">AXLE Nº1</th>
                <th className="border px-2 py-1">AXLE Nº2</th>
                <th className="border px-2 py-1">AXLE Nº3</th>
                <th className="border px-2 py-1">AXLE Nº4</th>
                <th className="border px-2 py-1 w-20">Limits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="5" className="border px-2 py-1 font-bold bg-gray-50 align-top">ALIGNMENT<br/>SUSPENSION</td>
                <td className="border px-2 py-1">Deviation (m/km)</td>
                <td className="border px-2 py-1 text-center font-semibold">-2.0</td>
                <td className="border px-2 py-1 text-center">0.0</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center text-[9px]">m/Km &lt;= 7</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Left Efficiency (%)</td>
                <td className="border px-2 py-1 text-center font-semibold">58</td>
                <td className="border px-2 py-1 text-center">52</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td rowSpan="4" className="border px-2 py-1 text-[9px] align-top">
                  <div className="text-right">
                    <p>% Sport Comfort</p>
                    <p>Defect &gt;= 41 &gt;= 41</p>
                    <p>Weak &gt;= 41 &gt;= 41</p>
                    <p>Diff. &lt;= 30 &lt;= 30</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Right Efficiency (%)</td>
                <td className="border px-2 py-1 text-center font-semibold">54</td>
                <td className="border px-2 py-1 text-center">48</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Difference (%)</td>
                <td className="border px-2 py-1 text-center">7</td>
                <td className="border px-2 py-1 text-center">8</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Suspension type:</td>
                <td colSpan="4" className="border px-2 py-1">Sport</td>
              </tr>
            </tbody>
          </table>

          {/* BRAKES Section */}
          <table className="w-full border border-gray-400 text-[10px] mb-2">
            <tbody>
              <tr>
                <td rowSpan="12" className="border px-2 py-1 font-bold bg-gray-50 align-top w-24">BRAKES</td>
                <td colSpan="5" className="border px-2 py-1 font-semibold bg-gray-100">SERVICE BRAKE</td>
                <td rowSpan="5" className="border px-2 py-1 text-[9px] align-top w-20">
                  <p className="text-center font-semibold">%</p>
                  <p>Diff. &lt;= 30</p>
                  <p>Serv. &gt;= 50</p>
                  <p>Hand &gt;= 25</p>
                </td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Left Force (KN)</td>
                <td className="border px-2 py-1 text-center font-semibold">17.53</td>
                <td className="border px-2 py-1 text-center">11.00</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Right Force (KN)</td>
                <td className="border px-2 py-1 text-center font-semibold">14.90</td>
                <td className="border px-2 py-1 text-center">9.46</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Axle Difference (%)</td>
                <td className="border px-2 py-1 text-center">15</td>
                <td className="border px-2 py-1 text-center">14</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Efficiency axle (%)</td>
                <td className="border px-2 py-1 text-center font-semibold">77</td>
                <td className="border px-2 py-1 text-center">57</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Total Efficiency(%):</td>
                <td colSpan="4" className="border px-2 py-1 text-center font-bold text-green-700">69</td>
                <td className="border px-2 py-1"></td>
              </tr>
              <tr>
                <td colSpan="5" className="border px-2 py-1 font-semibold bg-gray-100">PARKING BRAKE</td>
                <td className="border px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Left Force (KN)</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center font-semibold">12.57</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Right Force (KN)</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center font-semibold">10.05</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Axle Difference (%)</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">20</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Total Efficiency(%):</td>
                <td colSpan="4" className="border px-2 py-1 text-center font-bold text-green-700">30</td>
                <td className="border px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Axle Weight (Kg)</td>
                <td className="border px-2 py-1 text-center font-semibold">4212</td>
                <td className="border px-2 py-1 text-center">3588</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1 text-center">-</td>
                <td className="border px-2 py-1"></td>
              </tr>
            </tbody>
          </table>

          {/* TOTAL Row */}
          <div className="border border-gray-400 p-2 mb-2 flex justify-between items-center bg-gray-50">
            <span className="font-bold">TOTAL</span>
            <span>Vehicle efficiency: <strong className={`text-lg ${69 >= 50 ? 'text-green-700' : 'text-red-600'}`}>69</strong></span>
            <span>Peso Vehiculo (Kg): <strong>7800</strong></span>
          </div>

          {/* GAS ANALYZER */}
          <table className="w-full border border-gray-400 text-[10px] mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left w-28">GAS ANALYZER</th>
                <th className="border px-1 py-1">HC (ppm)</th>
                <th className="border px-1 py-1">CO (%)</th>
                <th className="border px-1 py-1">CO2 (%)</th>
                <th className="border px-1 py-1">COcorr (%)</th>
                <th className="border px-1 py-1">O2 (%)</th>
                <th className="border px-1 py-1">Lambda</th>
                <th className="border px-1 py-1">Temp.</th>
                <th className="border px-1 py-1">RPM</th>
                <th className="border px-2 py-1 w-24 text-[9px]">Limits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1 font-bold bg-gray-50">SMOKE METER</td>
                <td className="border px-1 py-1 text-center">55.25</td>
                <td className="border px-1 py-1 text-center">56.20</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td rowSpan="2" className="border px-2 py-1 text-[8px]">
                  HC: 0-600<br/>CO2: 12-16<br/>Lamb: 0.97-1.03
                </td>
              </tr>
              <tr>
                <td className="border px-2 py-1 text-[9px]">(K)</td>
                <td className="border px-1 py-1 text-center">1.87</td>
                <td className="border px-1 py-1 text-center">1.92</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
                <td className="border px-1 py-1 text-center">0.00</td>
              </tr>
            </tbody>
          </table>

          {/* HEADLIGHT */}
          <table className="w-full border border-gray-400 text-[10px] mb-3">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left w-28">HEADLIGHT</th>
                <th className="border px-2 py-1">Dipped Lf.</th>
                <th className="border px-2 py-1">Dipped Rg.</th>
                <th className="border px-2 py-1">Full Lf.</th>
                <th className="border px-2 py-1">Full Rg.</th>
                <th className="border px-2 py-1">Fog Lf.</th>
                <th className="border px-2 py-1">Fog Rg.</th>
                <th className="border px-2 py-1 w-24 text-[9px]">Limits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Intensity (cd)</td>
                <td className="border px-2 py-1 text-center font-semibold">9451</td>
                <td className="border px-2 py-1 text-center font-semibold">25657</td>
                <td className="border px-2 py-1 text-center">3490</td>
                <td className="border px-2 py-1 text-center">2040</td>
                <td className="border px-2 py-1 text-center">9251</td>
                <td className="border px-2 py-1 text-center">5541</td>
                <td className="border px-2 py-1 text-[8px]">
                  Dipped: 7000-1000000<br/>Full: 10000-1000000<br/>Fog: 800-1000000
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Signatures */}
          <div className="grid grid-cols-3 border-t-2 border-gray-800 pt-3 text-[10px]">
            <div className="text-center">
              <p className="font-bold uppercase">Inspector</p>
              <p className="mt-4 pt-4 border-t border-gray-400 mx-4">{inspection.meta?.inspectorName || 'Getu Tadesse'}</p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase">Result</p>
              <p className={`text-2xl font-bold mt-2 ${machinePass ? 'text-green-700' : 'text-red-600'}`}>
                {machinePass ? 'PASS' : 'FAIL'}
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase">Chief</p>
              <p className="mt-4 pt-4 border-t border-gray-400 mx-4">Alemayehu Bekele</p>
            </div>
          </div>
        </div>

        {/* PAGE 2: Visual Inspection - Heavy/Regular Vehicle Form Style */}
        <div className={`report-page border rounded-lg shadow-lg mx-auto p-6 bg-white page-break ${vehicleCategory === 'HEAVY' ? 'border-amber-300' : 'border-gray-300'}`} style={{ maxWidth: '210mm', fontSize: '10px' }}>
          {/* Header - Official Form Style */}
          <div className="border-b-2 border-gray-800 pb-3 mb-3">
            <div className="text-center">
              <p className="text-[9px] text-gray-600">በአዲስ አበባ ከተማ አስተዳደር የሾፌሮችና ተሽከርካሪዎች ፈቃድና ቁጥጥር ባለስልጣን</p>
              <p className="text-xs font-semibold">City Government of A.A Driver And Vehicles Licensing And Control Authority</p>
              <p className="text-[9px] text-gray-600 mt-1">{vehicleCategory === 'HEAVY' ? 'የከባድ ተሽከርካሪዎች ዓመታዊ የቴክኒክ ምርመራ ቅጽ' : 'የህዝብ አገልግሎት ተሽከርካሪ የእይታ ምርመራ ቅጽ'}</p>
              <h1 className={`text-sm font-bold mt-1 ${vehicleCategory === 'HEAVY' ? 'text-amber-800' : 'text-blue-800'}`}>
                {vehicleCategory === 'HEAVY' ? 'Heavy Vehicles Annual Technical Inspection Form' : 'Public Service Transport Service - Visual Inspection Form'}
              </h1>
            </div>
            <div className="flex justify-end text-[9px] mt-1">
              <span>ቁጥር / No. <strong className="border-b border-gray-400 px-2">{inspection.id.slice(-4)}</strong></span>
            </div>
          </div>

          {/* Vehicle Info Header */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
            <div className="flex"><span className="w-24">የምርመራ ቁጥር:</span><span className="border-b border-gray-400 flex-1 font-semibold px-1">{inspection.id}</span></div>
            <div className="flex"><span className="w-20">የሰሌዳ ቁጥር:</span><span className="border-b border-gray-400 flex-1 font-semibold px-1">{inspection.vehicle.plate}</span></div>
            <div className="flex"><span className="w-24">የባለቤት ስም:</span><span className="border-b border-gray-400 flex-1 font-semibold px-1">{canViewPII ? inspection.vehicle.owner.name : '***'}</span></div>
            <div className="flex"><span className="w-24">የባለቤትነት ደብተር:</span><span className="border-b border-gray-400 flex-1 px-1">-</span></div>
            <div className="flex"><span className="w-20">የሻሲ ቁጥር:</span><span className="border-b border-gray-400 flex-1 font-mono text-[9px] px-1">{formatChassis(inspection.vehicle.vin)}</span></div>
            <div className="flex"><span className="w-20">የሞተር ቁጥር:</span><span className="border-b border-gray-400 flex-1 font-mono text-[9px] px-1">{inspection.vehicle.vin?.slice(0, 10) || 'YC6L310-42'}</span></div>
          </div>

          {/* 30-Point Visual Inspection Table */}
          <table className="w-full border border-gray-500 text-[9px] mb-3">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-1 py-1 w-6 text-center">ተ.ቁ</th>
                <th className="border border-gray-400 px-1 py-1 text-left">ዝርዝር መስፈርት / Inspection Criteria</th>
                <th className="border border-gray-400 px-1 py-1 w-12 text-center">የተሰጠዉ<br/>ነጥብ</th>
                <th className="border border-gray-400 px-1 py-1 w-12 text-center">ትክክል<br/>Correct</th>
                <th className="border border-gray-400 px-1 py-1 w-14 text-center">ትክክልያልሆነ<br/>Not Correct</th>
                <th className="border border-gray-400 px-1 py-1 w-16 text-center">ምመሪ<br/>Remark</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, am: 'የምዝገባ ሰሌዳና የባለቤትነት', en: 'Reg Plate & Ownership', pts: 8, pass: true },
                { no: 2, am: 'የፊት ማቆሚያ መብራቶች', en: 'Front Position Lights', pts: null, pass: true },
                { no: 3, am: 'የኋላ ማቆሚያ መብራቶች', en: 'Rear Position Lights', pts: null, pass: true },
                { no: 4, am: 'የፍሬን መብራቶች', en: 'Brake Lights', pts: 10, pass: true },
                { no: 5, am: 'የኋላ መብራቶች', en: 'Reverse Lights', pts: null, pass: true },
                { no: 6, am: 'የማዞሪያ መብራቶች', en: 'Turn Signal Lights', pts: null, pass: true },
                { no: 7, am: 'የማቆሚያ መብራቶች', en: 'Parking Lights', pts: null, pass: true },
                { no: 8, am: 'የፍሬን መብራቶች (ተሳቢን ጨምሮ)', en: 'Brake Lights (incl. trailer)', pts: 14, pass: true },
                { no: 9, am: 'የሰሌዳ መብራት', en: 'Plate Light', pts: 8, pass: true },
                { no: 10, am: 'ጥሩምባ (ሆርን)', en: 'Horn Function', pts: null, pass: true },
                { no: 11, am: 'የዝናብ መጥረጊያ', en: 'Windshield Wipers', pts: null, pass: true },
                { no: 12, am: 'የመሪ ክፍሎች ሁኔታ', en: 'Steering Components', pts: null, pass: true },
                { no: 13, am: 'የኤሌክትሪክ ክፍሎች', en: 'Electrical Components', pts: 12, pass: true },
                { no: 14, am: 'የኃይል ማስተላለፊያ ክፍሎች', en: 'Transmission Components', pts: null, pass: true },
                { no: 15, am: 'ጎማዎች፣ ፍሬን፣ ማርሽ', en: 'Tires, Brakes, Transmission', pts: null, pass: true },
                { no: 16, am: 'የጎማ ናቶች', en: 'Wheel Nuts & Tires', pts: null, pass: true },
                { no: 17, am: 'የመንቀጥቀጫ ማስወገጃ', en: 'Shock Absorbers', pts: null, pass: true },
                { no: 18, am: 'የጭስ ማስወጫ', en: 'Exhaust System', pts: null, pass: true },
                { no: 19, am: 'የነዳጅ ስርዓት', en: 'Fuel System', pts: null, pass: true },
                { no: 20, am: 'ጎማዎች', en: 'Tires', pts: null, pass: true },
                { no: 21, am: 'የፍጥነት ገደብና GPS', en: 'Speed Limiter & GPS (Heavy)', pts: null, pass: vehicleCategory !== 'HEAVY' || true },
                { no: 22, am: 'የሰውነትና መስታወቶች', en: 'Body & Mirrors', pts: null, pass: true },
                { no: 23, am: 'የተሳፋሪ መቀመጫዎች', en: 'Passenger Seats (Heavy)', pts: null, pass: true },
                { no: 24, am: 'የእሳት ማጥፊያ', en: 'Fire Extinguisher', pts: null, pass: true },
                { no: 25, am: 'የመጀመሪያ ህክምና ሳጥን', en: 'First Aid Kit', pts: null, pass: true },
                { no: 26, am: 'የማስጠንቀቂያ ሶስት ማዕዘን', en: 'Warning Triangle', pts: null, pass: true },
                { no: 27, am: 'የተሽከርካሪ መስታወቶች', en: 'Vehicle Mirrors', pts: null, pass: true },
                { no: 28, am: 'የጎን መስታወቶች', en: 'Side Mirrors', pts: null, pass: true },
                { no: 29, am: 'መጠባበቂያ ጎማ', en: 'Spare Wheel', pts: null, pass: true },
                { no: 30, am: 'ጭቃ መከላከያ', en: 'Mudguards', pts: null, pass: true },
              ].map((item, i) => {
                // Match visual results if available
                const visualItem = inspection.visualResults?.[i];
                const itemPass = visualItem ? visualItem.status === "Pass" : item.pass;
                return (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="border border-gray-400 px-1 py-0.5 text-center">{item.no}.</td>
                    <td className="border border-gray-400 px-1 py-0.5">
                      <span className="text-[8px] text-gray-600">{item.am}</span><br/>
                      <span className="font-medium">{item.en}</span>
                    </td>
                    <td className="border border-gray-400 px-1 py-0.5 text-center font-semibold">{item.pts || '-'}</td>
                    <td className="border border-gray-400 px-1 py-0.5 text-center">
                      {itemPass && <span className="text-green-700 font-bold">✓</span>}
                    </td>
                    <td className="border border-gray-400 px-1 py-0.5 text-center">
                      {!itemPass && <span className="text-red-600 font-bold">✗</span>}
                    </td>
                    <td className="border border-gray-400 px-1 py-0.5 text-center text-gray-400">-</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary & Signatures */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border border-gray-400 p-2">
              <p className="text-[9px] text-gray-600">የመርማሪ ፊርማ / Inspector Signature</p>
              <div className="flex justify-between mt-2">
                <div><p className="text-[9px]">ስም:</p><p className="font-semibold">{inspection.meta?.inspectorName || 'Getu Tadesse'}</p></div>
                <div><p className="text-[9px]">ፊርማ:</p><p className="italic border-b border-gray-400 w-20">_________</p></div>
              </div>
            </div>
            <div className="border border-gray-400 p-2">
              <p className="text-[9px] text-gray-600">የኃላፊ ፊርማ / Chief Signature</p>
              <div className="flex justify-between items-center">
            <div>
                  <p className="text-[9px]">ቀን / Date:</p>
                  <p className="font-semibold">{inspectionDate}</p>
                </div>
                <div className={`text-xl font-bold ${overallResult === 'PASS' ? 'text-green-700' : 'text-red-600'}`}>
                  {overallResult === 'PASS' ? 'አልፏል' : 'አላለፈም'}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Combined Result */}
          <div className={`border-2 p-3 text-center ${overallResult === 'PASS' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <p className="text-[9px] text-gray-600">የጠቅላላ ውጤት / Overall Result</p>
            <p className="text-xs">የተሽከርካሪው የምርመራ ውጤት ከ 80% በታች ከሆነ ብቁ አይደለም ተብሎ ይቆጠራል</p>
            <div className="flex justify-center items-center gap-8 mt-2">
              <div>
                <p className="text-[9px]">Machine Test:</p>
                <p className={`font-bold ${machinePass ? 'text-green-700' : 'text-red-600'}`}>{machinePass ? 'PASS' : 'FAIL'}</p>
              </div>
              <div className={`text-2xl font-bold px-6 py-2 rounded ${overallResult === 'PASS' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {overallResult}
              </div>
              <div>
                <p className="text-[9px]">Visual Test:</p>
                <p className={`font-bold ${visualPass ? 'text-green-700' : 'text-red-600'}`}>{visualPass ? 'PASS' : 'FAIL'}</p>
              </div>
            </div>
            <p className="text-[9px] text-gray-500 mt-2">Valid Until: <strong>{expiryDate}</strong></p>
          </div>

          {inspection.paymentStatus === "Paid" && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 text-[10px] flex justify-between">
              <span>Payment: <strong>TeleBirr</strong></span>
              <span>Ref: <strong className="font-mono">TB{Date.now().toString().slice(-8)}</strong></span>
              <span>Amount: <strong className="text-green-700">ETB {inspection.amount || 402.50}</strong></span>
        </div>
          )}

          <p className="text-center text-[8px] text-gray-400 mt-2 pt-1 border-t">(እባክዎ ከመጠቀምዎ በፊት ትክክለኛ መሆኑን ያረጋግጡ / PLEASE MAKE SURE THAT THIS IS THE CORRECT ISSUE BEFORE USE) • ገጽ 2 ከ 2</p>
      </div>
      </div>
    </>
  );
}

export default InspectionDetail;
